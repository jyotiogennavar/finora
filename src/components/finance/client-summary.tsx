import { ClientAvatar } from "@/components/finance/client-avatar"
import { MoneyText } from "@/components/finance/money-text"
import { EntityStatusBadge, RiskBadge } from "@/components/finance/status-badge"
import { fullName } from "@/lib/format/labels"
import { cn } from "@/lib/utils"
import type { EntityStatus, RiskProfile } from "@/types/common"

export function ClientSummary({
  firstName,
  lastName,
  email,
  occupation,
  riskProfile,
  status,
  aum,
  className,
}: {
  firstName: string
  lastName: string
  email?: string
  occupation?: string
  riskProfile: RiskProfile
  status: EntityStatus
  aum?: number
  className?: string
}) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <ClientAvatar
        firstName={firstName}
        lastName={lastName}
        size="lg"
        labelled={false}
      />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className="truncate text-sm font-medium"
            title={fullName(firstName, lastName)}
          >
            {fullName(firstName, lastName)}
          </p>
          <EntityStatusBadge value={status} />
        </div>
        <p
          className="truncate text-xs text-muted-foreground"
          title={[occupation, email].filter(Boolean).join(" · ")}
        >
          {[occupation, email].filter(Boolean).join(" · ")}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <RiskBadge value={riskProfile} />
          {aum !== undefined ? (
            <MoneyText
              amount={aum}
              className="text-xs font-medium text-muted-foreground"
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
