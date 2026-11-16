import Link from "next/link"

import { ClientAvatar } from "@/components/finance/client-avatar"
import { MoneyText } from "@/components/finance/money-text"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import { EntityStatusBadge } from "@/components/finance/status-badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { fullName } from "@/lib/format/labels"
import { cn } from "@/lib/utils"
import type { EntityStatus } from "@/types/common"

export function PortfolioSummaryCard({
  name,
  client,
  currentValue,
  returnPercentage,
  absoluteReturn,
  holdingsCount,
  status = "ACTIVE",
  href,
}: {
  name: string
  client: { firstName: string; lastName: string }
  currentValue: number
  returnPercentage: number
  absoluteReturn: number
  holdingsCount: number
  status?: EntityStatus
  href?: string
}) {
  return (
    <Card data-slot="portfolio-summary-card">
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3">
          <ClientAvatar
            firstName={client.firstName}
            lastName={client.lastName}
            labelled={false}
          />
          <div className="min-w-0">
            <CardTitle className="truncate" title={name}>
              {href ? (
                <Link
                  href={href}
                  className="hover:underline underline-offset-4"
                >
                  {name}
                </Link>
              ) : (
                name
              )}
            </CardTitle>
            <CardDescription
              className="truncate"
              title={fullName(client.firstName, client.lastName)}
            >
              {fullName(client.firstName, client.lastName)}
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <EntityStatusBadge value={status} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <MoneyText
            amount={currentValue}
            className="text-2xl font-semibold tracking-tight"
          />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <ReturnIndicator value={returnPercentage} size="md" />
            <MoneyText
              amount={absoluteReturn}
              signed
              className={cn(
                "text-sm font-medium",
                absoluteReturn > 0 && "text-positive",
                absoluteReturn < 0 && "text-negative"
              )}
            />
          </div>
        </div>
        <p className="text-xs tabular-nums text-muted-foreground">
          {holdingsCount} {holdingsCount === 1 ? "holding" : "holdings"}
        </p>
      </CardContent>
    </Card>
  )
}
