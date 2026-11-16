import type { ReactNode } from "react"

import { AllocationSummary } from "@/components/finance/allocation-summary"
import { ClientAvatar } from "@/components/finance/client-avatar"
import { ClientSummary } from "@/components/finance/client-summary"
import { MetricCard } from "@/components/finance/metric-card"
import { MoneyText } from "@/components/finance/money-text"
import { PortfolioSummaryCard } from "@/components/finance/portfolio-summary-card"
import { PercentText } from "@/components/finance/percent-text"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import {
  EntityStatusBadge,
  RiskBadge,
  TransactionStatusBadge,
  TransactionTypeBadge,
} from "@/components/finance/status-badge"
import { MetricGrid } from "@/components/layout/dashboard-grid"
import { formatCompactInr } from "@/lib/format/inr"
import { formatPercent } from "@/lib/format/percent"

import {
  overview,
  portfolio,
  specimenClient,
  specimenClientAum,
  specimenPortfolioCards,
} from "./specimen-data"
import { Section, Specimen, Subheading } from "./specimen"

export function FinancialUiSection() {
  return (
    <Section
      id="financial-ui"
      title="03. Financial UI"
      description="Numbers, status, and people. Currency stays in Indian grouping; returns always carry a sign, a color, and an icon."
    >
      <div className="space-y-3">
        <Subheading>Portfolio metric cards</Subheading>
        <MetricGrid>
          <MetricCard
            label="Assets under advice"
            value={<MoneyText amount={overview.summary.totalAum} />}
            change={overview.summary.totalReturnPercentage}
            hint="versus net contributions"
          />
          <MetricCard
            label="Net contributions"
            value={<MoneyText amount={overview.summary.netContributions} />}
            hint="deposits minus withdrawals"
          />
          <MetricCard
            label="Unrealized P&L"
            value={
              <MoneyText amount={overview.summary.totalProfitLoss} signed />
            }
            change={overview.summary.totalReturnPercentage}
          />
          <MetricCard
            label="Active portfolios"
            value={overview.summary.activePortfolioCount}
            hint={`${overview.summary.clientCount} clients`}
          />
        </MetricGrid>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen className="space-y-4">
          <Subheading>Returns and performance</Subheading>
          <div className="flex flex-wrap gap-6">
            <ReturnIndicator value={12.45} size="md" />
            <ReturnIndicator value={-3.25} size="md" />
            <ReturnIndicator value={0} size="md" />
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Use ReturnIndicator for deltas. A minus icon marks a flat reading so
            color is never the only signal.
          </p>
        </Specimen>

        <Specimen className="space-y-4">
          <Subheading>Currency and percentages</Subheading>
          <dl className="space-y-2 text-sm">
            <FormatRow
              label="Full rupee"
              value={<MoneyText amount={12450000} />}
            />
            <FormatRow
              label="Compact"
              value={formatCompactInr(12450000)}
            />
            <FormatRow
              label="Signed P&L"
              value={<MoneyText amount={-84250} signed />}
            />
            <FormatRow
              label="Paise"
              value={<MoneyText amount={1840.5} fractionDigits={2} />}
            />
            <FormatRow
              label="Signed percent"
              value={<PercentText value={8.9} />}
            />
            <FormatRow
              label="Share of book"
              value={formatPercent(62, 0, { signed: false })}
            />
          </dl>
        </Specimen>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen className="space-y-4">
          <Subheading>Client avatars and profile</Subheading>
          <div className="flex items-center gap-3">
            <ClientAvatar
              firstName={specimenClient.firstName}
              lastName={specimenClient.lastName}
              size="sm"
            />
            <ClientAvatar
              firstName={specimenClient.firstName}
              lastName={specimenClient.lastName}
            />
            <ClientAvatar
              firstName={specimenClient.firstName}
              lastName={specimenClient.lastName}
              size="lg"
            />
          </div>
          <ClientSummary
            firstName={specimenClient.firstName}
            lastName={specimenClient.lastName}
            email={specimenClient.email}
            occupation={specimenClient.occupation}
            riskProfile={specimenClient.riskProfile}
            status={specimenClient.status}
            aum={specimenClientAum}
          />
        </Specimen>

        <Specimen className="space-y-4">
          <Subheading>Asset allocation</Subheading>
          <AllocationSummary items={portfolio.allocation} />
        </Specimen>
      </div>

      <div className="space-y-3">
        <Subheading>Portfolio summary cards</Subheading>
        <div className="grid gap-4 lg:grid-cols-3">
          {specimenPortfolioCards.map((item) => (
            <PortfolioSummaryCard
              key={item.id}
              name={item.name}
              client={item.client}
              status={item.status}
              currentValue={item.currentValue}
              returnPercentage={item.returnPercentage}
              absoluteReturn={item.absoluteReturn}
              holdingsCount={item.holdingsCount}
            />
          ))}
        </div>
      </div>

      <Specimen className="space-y-4">
        <Subheading>Financial status</Subheading>
        <div className="flex flex-col gap-4">
          <StatusRow label="Risk">
            <RiskBadge value="CONSERVATIVE" />
            <RiskBadge value="MODERATE" />
            <RiskBadge value="AGGRESSIVE" />
          </StatusRow>
          <StatusRow label="Entity">
            <EntityStatusBadge value="ACTIVE" />
            <EntityStatusBadge value="INACTIVE" />
          </StatusRow>
          <StatusRow label="Transaction">
            <TransactionTypeBadge value="BUY" />
            <TransactionTypeBadge value="SELL" />
            <TransactionTypeBadge value="DEPOSIT" />
            <TransactionTypeBadge value="WITHDRAWAL" />
            <TransactionTypeBadge value="DIVIDEND" />
            <TransactionTypeBadge value="INTEREST" />
          </StatusRow>
          <StatusRow label="Settlement">
            <TransactionStatusBadge value="COMPLETED" />
            <TransactionStatusBadge value="PENDING" />
            <TransactionStatusBadge value="FAILED" />
          </StatusRow>
        </div>
      </Specimen>
    </Section>
  )
}

function FormatRow({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  )
}

function StatusRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
