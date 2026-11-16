"use client"

import { useMemo, useState, type ReactNode } from "react"
import Link from "next/link"

import { AllocationTrendChart } from "@/components/charts/allocation-trend-chart"
import { BenchmarkChart } from "@/components/charts/benchmark-chart"
import { ComparisonChart } from "@/components/charts/comparison-chart"
import {
  sliceByTimeRange,
  TimeRangeSelector,
} from "@/components/charts/time-range-selector"
import { DataTable, type DataTableColumn } from "@/components/data/data-table"
import { EmptyState } from "@/components/data/empty-state"
import { AllocationSummary } from "@/components/finance/allocation-summary"
import { MoneyText } from "@/components/finance/money-text"
import { MetricCard } from "@/components/finance/metric-card"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import { RiskBadge } from "@/components/finance/status-badge"
import { PageHeader } from "@/components/layout/page-header"
import { MetricGrid } from "@/components/layout/dashboard-grid"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { priceAsOf } from "@/constants/market"
import { BookPerformance } from "@/features/dashboard/book-performance"
import type {
  BenchmarkSeries,
  BookAnalytics,
  ClientPerformanceRow,
} from "@/features/analytics/queries/get-book-analytics"
import { useChartRange, useWorkspaceSettings } from "@/features/settings/workspace-settings"
import { formatDisplayDate } from "@/lib/format/date"
import { fullName } from "@/lib/format/labels"
import { formatPercent } from "@/lib/format/percent"
import type { PerformancePoint } from "@/features/analytics/types"

export function AnalyticsView({ data }: { data: BookAnalytics }) {
  const settings = useWorkspaceSettings()
  const [benchmarkOverride, setBenchmarkOverride] = useState<string | null>(null)
  const benchmarkId = benchmarkOverride ?? settings.benchmarkId
  const benchmark =
    data.benchmarks.find((item) => item.id === benchmarkId) ?? data.benchmarks[0]

  const since = data.firstContributionDate
    ? `Since ${formatDisplayDate(data.firstContributionDate)}`
    : "Life of the book"

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Analytics"
        description={`AUM, returns, and how clients compare, marked to ${formatDisplayDate(priceAsOf)}.`}
      />

      <MetricGrid>
        <MetricCard
          label="Assets under advice"
          value={<MoneyText amount={data.aum} />}
          hint="Market value plus cash"
        />
        <MetricCard
          label="Return vs contributions"
          value={<MoneyText amount={data.absoluteReturn} signed />}
          change={data.returnPercentage}
          hint={since}
        />
        <MetricCard
          label="XIRR"
          value={<RateValue value={data.xirr} />}
          hint="Money-weighted, from deposits and withdrawals to the mark date"
        />
        <MetricCard
          label="Annualized return"
          value={<RateValue value={data.annualizedReturn} />}
          hint="Compounded from the first contribution"
        />
      </MetricGrid>

      <BookPerformance
        data={data.aumHistory}
        title="AUM growth"
        description="Total value of the book, including cash"
        emptyDescription="Value will chart once two month-ends are on the book."
      />

      <div className="grid items-start gap-4 xl:grid-cols-2">
        <SectionCard
          title="Client returns"
          description="Return versus contributions for each client."
        >
          {data.clients.length === 0 ? (
            <EmptyState
              title="No clients to compare"
              description="A funded portfolio will place its client on this chart."
            />
          ) : (
            <ComparisonChart
              data={data.clients.map((client) => ({
                label: fullName(client.firstName, client.lastName),
                value: client.returnPercentage,
              }))}
            />
          )}
        </SectionCard>

        {benchmark ? (
          <BenchmarkPanel
            benchmark={benchmark}
            benchmarks={data.benchmarks}
            portfolio={data.aumHistory}
            onBenchmark={setBenchmarkOverride}
          />
        ) : (
          <SectionCard
            title="Benchmark"
            description="No benchmark series is available."
          >
            <EmptyState
              title="No benchmark"
              description="A benchmark series is needed before the book can be compared."
            />
          </SectionCard>
        )}
      </div>

      <AllocationPanel data={data} />

      {benchmark ? (
        <ClientTable clients={data.clients} benchmark={benchmark} />
      ) : null}
    </div>
  )
}

function BenchmarkPanel({
  benchmark,
  benchmarks,
  portfolio,
  onBenchmark,
}: {
  benchmark: BenchmarkSeries
  benchmarks: BenchmarkSeries[]
  portfolio: PerformancePoint[]
  onBenchmark: (id: string) => void
}) {
  const [range, setRange] = useChartRange()
  const portfolioPoints = sliceByTimeRange(portfolio, range)
  const benchmarkPoints = sliceByTimeRange(benchmark.history, range)
  const portfolioReturn = rangeReturn(portfolioPoints)
  const benchmarkReturn = rangeReturn(benchmarkPoints)
  const gap =
    portfolioReturn !== null && benchmarkReturn !== null
      ? portfolioReturn - benchmarkReturn
      : null

  return (
    <SectionCard
      title="Benchmark comparison"
      description={`${benchmark.name}. Both lines are rebased to 100 at the start of the range.`}
      action={
        <TimeRangeSelector value={range} onChange={setRange} className="self-start" />
      }
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full space-y-2 sm:max-w-xs">
          <Label htmlFor="analytics-benchmark">Benchmark</Label>
          <Select
            value={benchmark.id}
            onValueChange={(value) => {
              if (value) onBenchmark(String(value))
            }}
          >
            <SelectTrigger id="analytics-benchmark" className="w-full text-base md:text-sm">
              <span className="line-clamp-1 flex flex-1 text-left">
                {benchmark.name}
              </span>
            </SelectTrigger>
            <SelectContent>
              {benchmarks.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Book</dt>
            <dd>
              {portfolioReturn === null ? (
                "—"
              ) : (
                <ReturnIndicator value={portfolioReturn} />
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{benchmark.symbol}</dt>
            <dd>
              {benchmarkReturn === null ? (
                "—"
              ) : (
                <ReturnIndicator value={benchmarkReturn} />
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Gap</dt>
            <dd>{gap === null ? "—" : <ReturnIndicator value={gap} />}</dd>
          </div>
        </dl>
      </div>
      {portfolioPoints.length < 2 || benchmarkPoints.length < 2 ? (
        <EmptyState
          title="Not enough history"
          description="The comparison needs two month-ends in this range."
        />
      ) : (
        <BenchmarkChart portfolio={portfolioPoints} benchmark={benchmarkPoints} />
      )}
    </SectionCard>
  )
}

function AllocationPanel({ data }: { data: BookAnalytics }) {
  const [range, setRange] = useChartRange()
  const points = sliceByTimeRange(data.allocationTrend, range)

  return (
    <SectionCard
      title="Asset allocation"
      description="How the mix moved across the year, ending at the current allocation."
      action={
        <TimeRangeSelector value={range} onChange={setRange} className="self-start" />
      }
    >
      {data.allocation.length === 0 ? (
        <EmptyState
          title="No assets to allocate"
          description="Holdings and cash will show the mix once a portfolio is funded."
        />
      ) : (
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          {points.length < 2 ? (
            <EmptyState
              title="Not enough history"
              description="The trend needs two month-ends in this range."
            />
          ) : (
            <AllocationTrendChart data={points} />
          )}
          <AllocationSummary items={data.allocation} />
        </div>
      )}
    </SectionCard>
  )
}

function ClientTable({
  clients,
  benchmark,
}: {
  clients: ClientPerformanceRow[]
  benchmark: BenchmarkSeries
}) {
  const columns = useMemo<DataTableColumn<ClientPerformanceRow>[]>(
    () => [
      {
        id: "client",
        header: "Client",
        sortable: true,
        sortValue: (row) => fullName(row.firstName, row.lastName),
        cell: (row) => (
          <div className="min-w-0">
            <Link
              href={`/clients/${row.id}`}
              className="font-medium hover:underline underline-offset-4"
            >
              {fullName(row.firstName, row.lastName)}
            </Link>
            <p className="text-xs text-muted-foreground">{row.clientCode}</p>
          </div>
        ),
      },
      {
        id: "risk",
        header: "Risk",
        sortable: true,
        sortValue: (row) => row.riskProfile,
        cell: (row) => <RiskBadge value={row.riskProfile} />,
      },
      {
        id: "aum",
        header: "AUM",
        align: "right",
        sortable: true,
        sortValue: (row) => row.aum,
        cell: (row) => <MoneyText amount={row.aum} />,
      },
      {
        id: "return",
        header: "Return",
        align: "right",
        sortable: true,
        sortValue: (row) => row.returnPercentage,
        cell: (row) => (
          <div className="flex justify-end">
            <ReturnIndicator value={row.returnPercentage} />
          </div>
        ),
      },
      {
        id: "xirr",
        header: "XIRR",
        align: "right",
        sortable: true,
        sortValue: (row) => row.xirr ?? Number.NEGATIVE_INFINITY,
        cell: (row) =>
          row.xirr === null ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <div className="flex justify-end">
              <ReturnIndicator value={row.xirr} />
            </div>
          ),
      },
      {
        id: "gap",
        header: `Vs ${benchmark.symbol}`,
        align: "right",
        sortable: true,
        sortValue: (row) => row.returnPercentage - benchmark.returnPercentage,
        cell: (row) => (
          <div className="flex justify-end">
            <ReturnIndicator
              value={row.returnPercentage - benchmark.returnPercentage}
            />
          </div>
        ),
      },
    ],
    [benchmark.returnPercentage, benchmark.symbol]
  )

  return (
    <section className="flex flex-col gap-3">
      <div className="max-w-prose space-y-1">
        <h2 className="font-heading text-base leading-snug font-medium text-balance">
          Client performance
        </h2>
        <p className="text-sm leading-6 text-pretty text-muted-foreground">
          Life-to-date return versus contributions. The gap subtracts the{" "}
          {benchmark.name} one-year return of{" "}
          {formatPercent(benchmark.returnPercentage)}.
        </p>
      </div>
      <DataTable
        rows={clients}
        columns={columns}
        rowKey={(row) => row.id}
        pageSize={8}
        search={(row, query) => {
          const name = fullName(row.firstName, row.lastName).toLowerCase()
          return (
            name.includes(query) || row.clientCode.toLowerCase().includes(query)
          )
        }}
        searchLabel="Search"
        searchPlaceholder="Client name or code"
        emptyTitle="No clients match"
        emptyDescription="Try another name or code."
      />
    </section>
  )
}

function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h2 className="font-heading text-base leading-snug font-medium text-balance">
              {title}
            </h2>
            <p className="text-sm text-pretty text-muted-foreground">{description}</p>
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function RateValue({ value }: { value: number | null }) {
  if (value === null) return <span className="text-muted-foreground">—</span>
  const tone =
    value > 0 ? "text-positive" : value < 0 ? "text-negative" : "text-muted-foreground"
  return <span className={tone}>{formatPercent(value)}</span>
}

function rangeReturn(points: PerformancePoint[]) {
  const start = points[0]?.value
  const end = points[points.length - 1]?.value
  if (
    points.length < 2 ||
    start === undefined ||
    end === undefined ||
    start === 0
  ) {
    return null
  }
  return ((end - start) / start) * 100
}
