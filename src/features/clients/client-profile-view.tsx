import type { ReactNode } from "react"

import { EmptyState } from "@/components/data/empty-state"
import { AllocationSummary } from "@/components/finance/allocation-summary"
import { ClientAvatar } from "@/components/finance/client-avatar"
import { MoneyText } from "@/components/finance/money-text"
import { PortfolioSummaryCard } from "@/components/finance/portfolio-summary-card"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import {
  EntityStatusBadge,
  RiskBadge,
} from "@/components/finance/status-badge"
import { MetricCard } from "@/components/finance/metric-card"
import { MetricGrid } from "@/components/layout/dashboard-grid"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import type { ClientProfile } from "@/features/clients/queries/get-client-profile"
import { formatDisplayDate } from "@/lib/format/date"
import { fullName } from "@/lib/format/labels"

export function ClientProfileView({ profile }: { profile: ClientProfile }) {
  const { client } = profile
  const name = fullName(client.firstName, client.lastName)
  const subtitle = [client.occupation, client.clientCode]
    .filter(Boolean)
    .join(" · ")

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <ClientAvatar
            firstName={client.firstName}
            lastName={client.lastName}
            size="lg"
            labelled={false}
          />
          <div className="flex max-w-prose flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {name}
            </h1>
            {subtitle ? (
              <p className="text-sm leading-6 text-pretty text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <RiskBadge value={client.riskProfile} />
          <EntityStatusBadge value={client.status} />
        </div>
      </header>

      <MetricGrid className="xl:grid-cols-3">
        <MetricCard
          label="Assets under advice"
          value={<MoneyText amount={profile.totalAum} />}
        />
        <MetricCard
          label="Return versus contributions"
          value={<ReturnIndicator value={profile.returnPercentage} size="md" />}
        />
        <MetricCard label="Portfolios" value={profile.portfolios.length} />
      </MetricGrid>

      <Card>
        <CardHeader>
          <h2 className="font-heading text-base leading-snug font-medium">
            Contact
          </h2>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail label="Email">
              <a
                href={`mailto:${client.email}`}
                className="hover:underline underline-offset-4"
              >
                {client.email}
              </a>
            </Detail>
            <Detail label="Phone">
              <a
                href={`tel:${client.phone.replace(/\s/g, "")}`}
                className="hover:underline underline-offset-4"
              >
                {client.phone}
              </a>
            </Detail>
            <Detail label="Date of birth">
              {formatDisplayDate(client.dateOfBirth)}
            </Detail>
            <Detail label="Client code">{client.clientCode}</Detail>
          </dl>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-base leading-snug font-medium">
          Portfolios
        </h2>
        {profile.portfolios.length === 0 ? (
          <EmptyState
            title="No portfolios yet"
            description="Accounts opened for this client will show their value and return here."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {profile.portfolios.map((portfolio) => (
              <PortfolioSummaryCard
                key={portfolio.id}
                href={`/portfolios/${portfolio.id}`}
                name={portfolio.name}
                client={client}
                currentValue={portfolio.currentValue}
                returnPercentage={portfolio.returnPercentage}
                absoluteReturn={portfolio.absoluteReturn}
                holdingsCount={portfolio.holdingsCount}
                status={portfolio.status}
              />
            ))}
          </div>
        )}
      </section>

      {profile.allocation.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="space-y-1">
              <h2 className="font-heading text-base leading-snug font-medium">
                Asset allocation
              </h2>
              <p className="text-sm text-pretty text-muted-foreground">
                Across this client&apos;s portfolios, including cash.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <AllocationSummary items={profile.allocation} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function Detail({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  )
}
