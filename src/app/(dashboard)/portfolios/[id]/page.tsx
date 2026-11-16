import type { Metadata } from "next"
import Link from "next/link"

import { EmptyState } from "@/components/data/empty-state"
import { AllocationSummary } from "@/components/finance/allocation-summary"
import { MoneyText } from "@/components/finance/money-text"
import { MetricCard } from "@/components/finance/metric-card"
import { EntityStatusBadge } from "@/components/finance/status-badge"
import { BookPerformance } from "@/features/dashboard/book-performance"
import { HoldingsTable } from "@/features/portfolios/holdings-table"
import { getPortfolioDetail } from "@/features/portfolios/queries/get-portfolio-summary"
import { MetricGrid } from "@/components/layout/dashboard-grid"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatInr } from "@/lib/format/inr"
import { fullName } from "@/lib/format/labels"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const detail = getPortfolioDetail(id)
  return { title: detail?.portfolio.name ?? "Portfolio" }
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const detail = getPortfolioDetail(id)

  if (!detail) {
    return (
      <EmptyState
        title="This portfolio isn't on the book"
        description="The link may be out of date."
        action={
          <Button variant="outline" render={<Link href="/portfolios" />}>
            All portfolios
          </Button>
        }
      />
    )
  }

  const { portfolio, client, metrics, allocation, benchmark, performance } =
    detail
  const mix = instrumentMix(detail.stockCount, detail.fundCount)
  const clientName = client
    ? fullName(client.firstName, client.lastName)
    : "Unknown client"

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={portfolio.name}
        description={
          <>
            {client ? (
              <Link
                href={`/clients/${client.id}`}
                className="font-medium text-foreground hover:underline underline-offset-4"
              >
                {clientName}
              </Link>
            ) : (
              clientName
            )}
            {` · ${portfolio.portfolioCode}`}
            {benchmark ? ` · ${benchmark.name}` : ""}
          </>
        }
        actions={<EntityStatusBadge value={portfolio.status} />}
      />

      <MetricGrid className="xl:grid-cols-3">
        <MetricCard
          label="Current value"
          value={<MoneyText amount={metrics.currentValue} />}
          change={metrics.returnPercentage}
          hint={
            metrics.cashBalance > 0
              ? `${formatInr(metrics.cashBalance, 0)} in cash`
              : undefined
          }
        />
        <MetricCard
          label="Gain versus contributions"
          value={<MoneyText amount={metrics.absoluteReturn} signed />}
        />
        <MetricCard
          label="Holdings"
          value={detail.holdingRows.length}
          hint={mix || undefined}
        />
      </MetricGrid>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <BookPerformance
          data={performance?.history ?? []}
          title="Performance"
          description={
            benchmark
              ? `Month-end value, marked against ${benchmark.name}.`
              : "Month-end value of this portfolio."
          }
          emptyDescription="Value will chart once two month-ends are recorded."
        />
        <Card>
          <CardHeader>
            <div className="space-y-1">
              <h2 className="font-heading text-base leading-snug font-medium text-balance">
                Asset allocation
              </h2>
              <p className="text-sm text-pretty text-muted-foreground">
                Holdings and cash in this portfolio.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {allocation.length > 0 ? (
              <AllocationSummary items={allocation} />
            ) : (
              <EmptyState
                title="No allocation yet"
                description="Holdings and cash will split the portfolio once they have value."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-1">
            <h2 className="font-heading text-base leading-snug font-medium text-balance">
              Holdings
            </h2>
            <p className="text-sm text-pretty text-muted-foreground">
              {detail.holdingRows.length}{" "}
              {detail.holdingRows.length === 1 ? "position" : "positions"}
              {mix ? ` · ${mix}` : ""}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <HoldingsTable rows={detail.holdingRows} />
        </CardContent>
      </Card>
    </div>
  )
}

function instrumentMix(stocks: number, funds: number) {
  const parts: string[] = []
  if (stocks > 0) {
    parts.push(`${stocks} ${stocks === 1 ? "stock" : "stocks"}`)
  }
  if (funds > 0) {
    parts.push(`${funds} ${funds === 1 ? "mutual fund" : "mutual funds"}`)
  }
  return parts.join(" · ")
}
