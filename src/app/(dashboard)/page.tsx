import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"

import { ClientPortfolioList } from "@/components/data/client-portfolio-list"
import { EmptyState } from "@/components/data/empty-state"
import { TransactionRow } from "@/components/data/transaction-row"
import { AllocationSummary } from "@/components/finance/allocation-summary"
import { ClientAvatar } from "@/components/finance/client-avatar"
import { MoneyText } from "@/components/finance/money-text"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import { PageHeader } from "@/components/layout/page-header"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { priceAsOf } from "@/constants/market"
import { BookPerformance } from "@/features/dashboard/book-performance"
import { equityBands } from "@/features/dashboard/attention"
import type {
  DashboardAttentionClient,
  DashboardFlows,
  DashboardSummary,
} from "@/features/dashboard/types"
import { getDashboardOverview } from "@/features/dashboard/queries/get-dashboard-overview"
import { formatDisplayDate } from "@/lib/format/date"
import { fullName, riskProfileLabels } from "@/lib/format/labels"
import { formatPercent } from "@/lib/format/percent"
import { cn } from "@/lib/utils"
import type { RiskProfile } from "@/types/common"

export const metadata: Metadata = {
  title: "Dashboard",
}

const shownAttention = 5

export default function DashboardPage() {
  const overview = getDashboardOverview()
  const attention = overview.attention.slice(0, shownAttention)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Dashboard"
        description={`The book under advice, marked to ${formatDisplayDate(priceAsOf)}.`}
      />

      <BookSummary summary={overview.summary} flows={overview.flows} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <BookPerformance data={overview.performanceHistory} />
          <Panel
            title="Recent transactions"
            description="Latest settled movements"
            action={<PanelLink href="/transactions">All transactions</PanelLink>}
          >
            {overview.recentActivity.length === 0 ? (
              <EmptyState
                title="No settled transactions"
                description="Deposits, trades, and income will show up here once they settle."
              />
            ) : (
              <ul className="divide-y">
                {overview.recentActivity.map((item) => (
                  <li key={item.transaction.id}>
                    <TransactionRow
                      transaction={item.transaction}
                      subtitle={`${item.clientName} · ${item.portfolioName}`}
                      showStatus={false}
                    />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Panel
            title="Asset allocation"
            description="Current mix, including cash"
          >
            {overview.allocation.length === 0 ? (
              <EmptyState
                title="No assets to allocate"
                description="Holdings and cash will show the mix once a portfolio is funded."
              />
            ) : (
              <AllocationSummary items={overview.allocation} />
            )}
          </Panel>

          <Panel
            title="Clients requiring attention"
            description={attentionDescription(overview.attention)}
            action={<PanelLink href="/clients">All clients</PanelLink>}
          >
            {attention.length === 0 ? (
              <EmptyState
                title="No clients need a review"
                description="Every book is inside its equity band and above the money contributed."
              />
            ) : (
              <ul className="divide-y">
                {attention.map((client) => (
                  <li key={client.clientId} className="flex items-start gap-3 py-3">
                    <ClientAvatar
                      firstName={client.firstName}
                      lastName={client.lastName}
                      labelled={false}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p
                          className="truncate text-sm font-medium"
                          title={fullName(client.firstName, client.lastName)}
                        >
                          {fullName(client.firstName, client.lastName)}
                        </p>
                        <MoneyText
                          amount={client.totalAum}
                          className="shrink-0 text-sm"
                        />
                      </div>
                      <p className="mt-1 text-xs leading-5 text-pretty text-muted-foreground">
                        {attentionReason(client)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Largest portfolios"
            description="By current value"
          >
            {overview.topPortfolios.length === 0 ? (
              <EmptyState
                title="No portfolios yet"
                description="A funded account will show up here with its value and return."
              />
            ) : (
              <ClientPortfolioList
                items={overview.topPortfolios.map((item) => ({
                  id: item.portfolioId,
                  name: item.portfolioName,
                  currentValue: item.currentValue,
                  returnPercentage: item.returnPercentage,
                }))}
              />
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}

function BookSummary({
  summary,
  flows,
}: {
  summary: DashboardSummary
  flows: DashboardFlows
}) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <CardDescription>Assets under advice</CardDescription>
            <p className="text-3xl font-semibold tabular-nums tracking-tight">
              <MoneyText amount={summary.totalAum} />
            </p>
          </div>
          <div className="flex flex-col gap-1 sm:items-end">
            <ReturnIndicator value={summary.totalReturnPercentage} size="md" />
            <p className="text-xs leading-5 text-muted-foreground">
              <MoneyText
                amount={summary.totalProfitLoss}
                signed
                className={cn(
                  "font-medium",
                  summary.totalProfitLoss > 0 && "text-positive",
                  summary.totalProfitLoss < 0 && "text-negative"
                )}
              />{" "}
              versus contributions
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
          <BookFact
            label="Clients"
            value={summary.clientCount}
            hint={
              summary.activeClientCount === summary.clientCount
                ? "All active"
                : `${summary.activeClientCount} active`
            }
          />
          <BookFact
            label="Active portfolios"
            value={summary.activePortfolioCount}
            hint={
              summary.activePortfolioCount === summary.portfolioCount
                ? "All open"
                : `${summary.portfolioCount - summary.activePortfolioCount} closed`
            }
          />
          <BookFact
            label="Inflows"
            value={<MoneyText amount={flows.inflows} />}
            hint={countPhrase(flows.inflowCount, "deposit", "deposits")}
          />
          <BookFact
            label="Outflows"
            value={<MoneyText amount={flows.outflows} />}
            hint={countPhrase(flows.outflowCount, "withdrawal", "withdrawals")}
          />
        </dl>
      </CardContent>
    </Card>
  )
}

function BookFact({
  label,
  value,
  hint,
}: {
  label: string
  value: ReactNode
  hint: string
}) {
  return (
    <div className="space-y-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="space-y-1">
        <span className="block text-xl font-semibold tabular-nums tracking-tight">
          {value}
        </span>
        <span className="block text-xs leading-5 text-muted-foreground">
          {hint}
        </span>
      </dd>
    </div>
  )
}

function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h2 className="font-heading text-base leading-snug font-medium text-balance">
              {title}
            </h2>
            <p className="text-sm text-pretty text-muted-foreground">
              {description}
            </p>
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function PanelLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0")}
    >
      {children}
    </Link>
  )
}

function attentionDescription(clients: DashboardAttentionClient[]) {
  if (clients.length === 0) return "Nothing is outside the usual range."

  const equityOnly = clients.every(
    (client) => client.kind === "equity-high" || client.kind === "equity-low"
  )

  if (equityOnly) {
    return clients.length === 1
      ? "Equity weight is outside the risk-profile band."
      : `${clients.length} clients are outside their equity band. Widest gaps first.`
  }

  return clients.length === 1
    ? "Outside the usual range for this book."
    : `${clients.length} clients need a review. Widest gaps first.`
}

function attentionReason(client: DashboardAttentionClient) {
  if (client.kind === "inactive") {
    return "Marked inactive while assets are still on the book."
  }

  if (client.kind === "negative-return") {
    return `Down ${formatPercent(Math.abs(client.returnPercentage), 1, { signed: false })} versus money contributed.`
  }

  const band = equityBands[client.riskProfile]
  const equity = equityShare(client.equityPercentage, band)
  const profile = profilePhrase(client.riskProfile)

  if (client.kind === "equity-high") {
    return `Equity is ${equity} of the book. ${profile} stays under ${formatPercent(band.max, 0, { signed: false })}.`
  }

  return `Equity is ${equity} of the book. ${profile} stays above ${formatPercent(band.min, 0, { signed: false })}.`
}

function equityShare(
  value: number,
  band: { min: number; max: number }
) {
  const rounded = Math.round(value)
  const digits = rounded === band.min || rounded === band.max ? 1 : 0
  return formatPercent(value, digits, { signed: false })
}

function profilePhrase(profile: RiskProfile) {
  const label = riskProfileLabels[profile].toLowerCase()
  const article = label === "aggressive" ? "An" : "A"
  return `${article} ${label} profile`
}

function countPhrase(count: number, singular: string, plural: string) {
  if (count === 0) return `No ${plural}`
  if (count === 1) return `1 ${singular}`
  return `${count} ${plural}`
}
