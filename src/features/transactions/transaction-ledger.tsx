"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import { DataTable, type DataTableColumn } from "@/components/data/data-table"
import { MoneyText } from "@/components/finance/money-text"
import { MetricCard } from "@/components/finance/metric-card"
import {
  TransactionStatusBadge,
  TransactionTypeBadge,
} from "@/components/finance/status-badge"
import { PageHeader } from "@/components/layout/page-header"
import { MetricGrid } from "@/components/layout/dashboard-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { numberLocale, priceAsOf } from "@/constants/market"
import type { LedgerKind, LedgerRow } from "@/features/transactions/queries/get-transaction-ledger"
import { formatDisplayDate } from "@/lib/format/date"
import { transactionStatusLabels } from "@/lib/format/labels"
import { cn } from "@/lib/utils"
import type { TransactionStatus, TransactionType } from "@/features/transactions/types"

const tabs = [
  { id: "history", label: "History" },
  { id: "trades", label: "Purchases & redemptions" },
  { id: "sips", label: "SIPs" },
  { id: "income", label: "Dividends" },
] as const

type LedgerTab = (typeof tabs)[number]["id"]
type DatePreset = "all" | "3M" | "6M" | "1Y" | "custom"

const tabKinds: Record<LedgerTab, LedgerKind[] | null> = {
  history: null,
  trades: ["PURCHASE", "REDEMPTION"],
  sips: ["SIP"],
  income: ["DIVIDEND", "INTEREST"],
}

const tabCopy: Record<LedgerTab, { title: string; description: string }> = {
  history: {
    title: "No transactions in this range",
    description: "Try a wider date range, or clear the filters.",
  },
  trades: {
    title: "No purchases or redemptions",
    description:
      "Lump-sum buys and sells land here. Mutual fund purchases are listed under SIPs.",
  },
  sips: {
    title: "No SIP transactions",
    description: "Mutual fund purchases in this range will show here.",
  },
  income: {
    title: "No dividends or interest",
    description: "Income credited to a portfolio will show here.",
  },
}

const datePresets: { id: DatePreset; label: string }[] = [
  { id: "all", label: "All" },
  { id: "3M", label: "3M" },
  { id: "6M", label: "6M" },
  { id: "1Y", label: "1Y" },
  { id: "custom", label: "Custom" },
]

const quantityFormat = new Intl.NumberFormat(numberLocale, {
  maximumFractionDigits: 2,
})

const columns: DataTableColumn<LedgerRow>[] = [
  {
    id: "date",
    header: "Date",
    sortable: true,
    sortValue: (row) => row.date,
    cell: (row) => (
      <span className="whitespace-nowrap">{formatDisplayDate(row.date)}</span>
    ),
  },
  {
    id: "activity",
    header: "Activity",
    sortable: true,
    sortValue: (row) => row.kind,
    cell: (row) => <ActivityBadge kind={row.kind} type={row.type} />,
  },
  {
    id: "details",
    header: "Details",
    sortable: true,
    sortValue: (row) => row.assetName ?? row.description,
    cell: (row) => (
      <div className="min-w-0">
        <p className="truncate font-medium" title={row.assetName ?? row.description}>
          {row.assetName ?? row.description}
        </p>
        <p className="truncate text-xs text-muted-foreground">{detailLine(row)}</p>
      </div>
    ),
  },
  {
    id: "client",
    header: "Client",
    sortable: true,
    sortValue: (row) => row.clientName,
    cell: (row) => (
      <Link
        href={`/clients/${row.clientId}`}
        className="hover:underline underline-offset-4"
      >
        {row.clientName}
      </Link>
    ),
  },
  {
    id: "portfolio",
    header: "Portfolio",
    sortable: true,
    sortValue: (row) => row.portfolioName,
    cell: (row) => (
      <Link
        href={`/portfolios/${row.portfolioId}`}
        className="hover:underline underline-offset-4"
      >
        {row.portfolioName}
      </Link>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    align: "right",
    sortable: true,
    sortValue: (row) => signedAmount(row),
    cell: (row) => (
      <div className="flex flex-col items-end gap-1">
        <MoneyText amount={signedAmount(row)} signed className="font-medium" />
        <TransactionStatusBadge value={row.status} />
      </div>
    ),
  },
]

export function TransactionLedger({ rows }: { rows: LedgerRow[] }) {
  const [tab, setTab] = useState<LedgerTab>("history")
  const [preset, setPreset] = useState<DatePreset>("all")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [clientId, setClientId] = useState("all")
  const [portfolioId, setPortfolioId] = useState("all")
  const [status, setStatus] = useState<"all" | TransactionStatus>("all")
  const [tableKey, setTableKey] = useState(0)

  const bounds = useMemo(() => {
    const dates = rows.map((row) => row.date).sort()
    return {
      min: dates[0] ?? priceAsOf,
      max: dates[dates.length - 1] ?? priceAsOf,
    }
  }, [rows])

  const clients = useMemo(() => {
    const map = new Map<string, string>()
    for (const row of rows) map.set(row.clientId, row.clientName)
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [rows])

  const portfolios = useMemo(() => {
    const map = new Map<string, { name: string; clientId: string }>()
    for (const row of rows) {
      map.set(row.portfolioId, {
        name: row.portfolioName,
        clientId: row.clientId,
      })
    }
    return [...map.entries()]
      .filter(([, portfolio]) => clientId === "all" || portfolio.clientId === clientId)
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
  }, [clientId, rows])

  const range = resolveRange(preset, from, to)
  const dateError =
    preset === "custom" && from && to && from > to
      ? "The start date is after the end date."
      : undefined

  const scoped = rows.filter((row) => {
    if (clientId !== "all" && row.clientId !== clientId) return false
    if (portfolioId !== "all" && row.portfolioId !== portfolioId) return false
    if (status !== "all" && row.status !== status) return false
    if (dateError) return false
    if (range.from && row.date < range.from) return false
    if (range.to && row.date > range.to) return false
    return true
  })

  const kinds = tabKinds[tab]
  const visible = kinds ? scoped.filter((row) => kinds.includes(row.kind)) : scoped
  const totals = summarize(scoped)
  const filtersActive =
    preset !== "all" || clientId !== "all" || portfolioId !== "all" || status !== "all"

  function choosePreset(next: DatePreset) {
    setPreset(next)
    if (next === "custom") {
      setFrom((current) => current || bounds.min)
      setTo((current) => current || bounds.max)
    }
  }

  function clearFilters() {
    setPreset("all")
    setFrom("")
    setTo("")
    setClientId("all")
    setPortfolioId("all")
    setStatus("all")
    setTableKey((key) => key + 1)
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Transactions"
        description="Purchases, redemptions, SIP installments, dividends, and cash movements."
      />

      <MetricGrid>
        <MetricCard
          label="Purchases"
          value={<MoneyText amount={totals.purchases} />}
          hint={
            totals.redemptionCount === 0 ? (
              "No redemptions in this range."
            ) : (
              <>
                Redemptions <MoneyText amount={totals.redemptions} />
              </>
            )
          }
        />
        <MetricCard
          label="SIP installments"
          value={<MoneyText amount={totals.sips} />}
          hint={countPhrase(totals.sipCount, "mutual fund purchase", "mutual fund purchases")}
        />
        <MetricCard
          label="Dividends"
          value={<MoneyText amount={totals.dividends} />}
          hint={
            totals.interest === 0 ? (
              "No interest in this range."
            ) : (
              <>
                Interest <MoneyText amount={totals.interest} />
              </>
            )
          }
        />
        <MetricCard
          label="Movements"
          value={scoped.length}
          hint={rangeHint(preset, range)}
        />
      </MetricGrid>

      <div className="flex flex-col gap-3">
        <Tabs
          value={tab}
          onValueChange={(value) => {
            if (
              value === "history" ||
              value === "trades" ||
              value === "sips" ||
              value === "income"
            ) {
              setTab(value)
            }
          }}
        >
          <TabsList className="h-auto! max-w-full flex-wrap">
            {tabs.map((item) => (
              <TabsTrigger key={item.id} value={item.id} className="flex-none px-2.5">
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <DateRangeControl
            preset={preset}
            from={from}
            to={to}
            min={bounds.min}
            max={bounds.max}
            error={dateError}
            onPreset={choosePreset}
            onFrom={setFrom}
            onTo={setTo}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <FilterSelect
              id="txn-client"
              label="Client"
              value={clientId}
              onChange={(value) => {
                setClientId(value)
                setPortfolioId("all")
              }}
              options={[["all", "All clients"], ...clients]}
            />
            <FilterSelect
              id="txn-portfolio"
              label="Portfolio"
              value={portfolioId}
              onChange={setPortfolioId}
              options={[
                ["all", "All portfolios"],
                ...portfolios.map(([id, portfolio]) => [id, portfolio.name] as [string, string]),
              ]}
            />
            <FilterSelect
              id="txn-status"
              label="Status"
              value={status}
              onChange={(value) => setStatus(value as "all" | TransactionStatus)}
              options={[
                ["all", "All statuses"],
                ...Object.entries(transactionStatusLabels),
              ]}
            />
            {filtersActive ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>
        </div>

        <DataTable
          key={tableKey}
          rows={visible}
          columns={columns}
          rowKey={(row) => row.id}
          pageSize={10}
          search={(row, query) => {
            const haystack = [
              row.clientName,
              row.portfolioName,
              row.code,
              row.description,
              row.assetName ?? "",
              row.assetSymbol ?? "",
            ]
              .join(" ")
              .toLowerCase()
            return haystack.includes(query)
          }}
          searchLabel="Search"
          searchPlaceholder="Client, portfolio, code, or fund"
          emptyTitle={dateError ? "Check the dates" : tabCopy[tab].title}
          emptyDescription={dateError ?? tabCopy[tab].description}
        />
      </div>
    </div>
  )
}

function ActivityBadge({
  kind,
  type,
}: {
  kind: LedgerKind
  type: TransactionType
}) {
  if (kind === "SIP") {
    return (
      <Badge variant="secondary" className="border-0 bg-information/15 text-information">
        SIP
      </Badge>
    )
  }
  return <TransactionTypeBadge value={type} />
}

function DateRangeControl({
  preset,
  from,
  to,
  min,
  max,
  error,
  onPreset,
  onFrom,
  onTo,
}: {
  preset: DatePreset
  from: string
  to: string
  min: string
  max: string
  error?: string
  onPreset: (preset: DatePreset) => void
  onFrom: (value: string) => void
  onTo: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label id="txn-range-label">Date range</Label>
      <div
        role="radiogroup"
        aria-labelledby="txn-range-label"
        className="inline-flex h-10 max-w-full select-none items-center rounded-lg bg-muted p-1 text-muted-foreground"
      >
        {datePresets.map((item) => {
          const selected = item.id === preset
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={cn(
                "relative h-8 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium outline-none transition-[color,background-color,transform] duration-150 ease-out before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] active:scale-[0.96] focus-visible:ring-3 focus-visible:ring-ring/50",
                selected
                  ? "bg-background text-foreground"
                  : "[@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
              )}
              onClick={() => onPreset(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        3M, 6M, and 1Y end on {formatDisplayDate(priceAsOf)}, the mark date.
      </p>
      {preset === "custom" ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="space-y-2">
            <Label htmlFor="txn-from">From</Label>
            <Input
              id="txn-from"
              type="date"
              value={from}
              min={min}
              max={max}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "txn-range-error" : undefined}
              onChange={(event) => onFrom(event.target.value)}
              className="w-full sm:w-44"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="txn-to">To</Label>
            <Input
              id="txn-to"
              type="date"
              value={to}
              min={min}
              max={max}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "txn-range-error" : undefined}
              onChange={(event) => onTo(event.target.value)}
              className="w-full sm:w-44"
            />
          </div>
        </div>
      ) : null}
      {error ? (
        <p id="txn-range-error" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: [string, string][]
}) {
  return (
    <div className="w-full space-y-2 sm:w-44">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next) onChange(String(next))
        }}
      >
        <SelectTrigger id={id} className="w-full text-base md:text-sm">
          <span className="line-clamp-1 flex flex-1 text-left">
            {options.find(([optionValue]) => optionValue === value)?.[1] ?? "All"}
          </span>
        </SelectTrigger>
        <SelectContent>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function resolveRange(preset: DatePreset, from: string, to: string) {
  if (preset === "all") return { from: "", to: "" }
  if (preset === "custom") return { from, to }
  const months = preset === "3M" ? 3 : preset === "6M" ? 6 : 12
  return { from: shiftMonths(priceAsOf, months), to: priceAsOf }
}

function shiftMonths(iso: string, months: number) {
  const [year, month, day] = iso.split("-").map(Number)
  const cursor = new Date(year, month - 1 - months, 1)
  const lastDay = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  cursor.setDate(Math.min(day, lastDay))
  const y = cursor.getFullYear()
  const m = String(cursor.getMonth() + 1).padStart(2, "0")
  const d = String(cursor.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function signedAmount(row: LedgerRow) {
  if (row.kind === "PURCHASE" || row.kind === "SIP" || row.kind === "WITHDRAWAL") {
    return -row.amount
  }
  return row.amount
}

function detailLine(row: LedgerRow) {
  const parts = [row.code]
  if (row.quantity) parts.push(`${quantityFormat.format(row.quantity)} units`)
  if (row.assetSymbol) parts.push(row.assetSymbol)
  return parts.join(" · ")
}

function summarize(rows: LedgerRow[]) {
  const totals = {
    purchases: 0,
    redemptions: 0,
    redemptionCount: 0,
    sips: 0,
    sipCount: 0,
    dividends: 0,
    interest: 0,
  }
  for (const row of rows) {
    if (row.kind === "PURCHASE") totals.purchases += row.amount
    if (row.kind === "REDEMPTION") {
      totals.redemptions += row.amount
      totals.redemptionCount += 1
    }
    if (row.kind === "SIP") {
      totals.sips += row.amount
      totals.sipCount += 1
    }
    if (row.kind === "DIVIDEND") totals.dividends += row.amount
    if (row.kind === "INTEREST") totals.interest += row.amount
  }
  return totals
}

function rangeHint(
  preset: DatePreset,
  range: { from: string; to: string }
) {
  if (preset === "all") return "Full history"
  if (!range.from || !range.to) return "Choose a start and end date"
  return `${formatDisplayDate(range.from)} – ${formatDisplayDate(range.to)}`
}

function countPhrase(count: number, singular: string, plural: string) {
  if (count === 0) return `No ${plural}`
  if (count === 1) return `1 ${singular}`
  return `${count} ${plural}`
}
