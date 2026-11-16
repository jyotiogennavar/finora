import { Badge } from "@/components/ui/badge"
import {
  entityStatusLabels,
  riskProfileLabels,
  transactionStatusLabels,
  transactionTypeLabels,
} from "@/lib/format/labels"
import { cn } from "@/lib/utils"
import type { EntityStatus, RiskProfile } from "@/types/common"
import type {
  TransactionStatus,
  TransactionType,
} from "@/features/transactions/types"

const toneClass = {
  active: "bg-active/15 text-active",
  pending: "bg-pending/15 text-pending",
  success: "bg-success/15 text-success",
  negative: "bg-negative/15 text-negative",
  information: "bg-information/15 text-information",
  overdue: "bg-overdue/15 text-overdue",
  muted: "bg-muted text-muted-foreground",
} as const

type Tone = keyof typeof toneClass

const riskTone: Record<RiskProfile, Tone> = {
  CONSERVATIVE: "information",
  MODERATE: "pending",
  AGGRESSIVE: "overdue",
}

const entityTone: Record<EntityStatus, Tone> = {
  ACTIVE: "active",
  INACTIVE: "muted",
}

const transactionTypeTone: Record<TransactionType, Tone> = {
  BUY: "information",
  SELL: "overdue",
  DIVIDEND: "success",
  DEPOSIT: "active",
  WITHDRAWAL: "muted",
  INTEREST: "success",
}

const transactionStatusTone: Record<TransactionStatus, Tone> = {
  COMPLETED: "success",
  PENDING: "pending",
  FAILED: "negative",
}

function StatusChip({
  label,
  tone,
  className,
}: {
  label: string
  tone: Tone
  className?: string
}) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-0", toneClass[tone], className)}
    >
      {label}
    </Badge>
  )
}

export function RiskBadge({ value }: { value: RiskProfile }) {
  return (
    <StatusChip label={riskProfileLabels[value]} tone={riskTone[value]} />
  )
}

export function EntityStatusBadge({ value }: { value: EntityStatus }) {
  return (
    <StatusChip label={entityStatusLabels[value]} tone={entityTone[value]} />
  )
}

export function TransactionTypeBadge({ value }: { value: TransactionType }) {
  return (
    <StatusChip
      label={transactionTypeLabels[value]}
      tone={transactionTypeTone[value]}
    />
  )
}

export function TransactionStatusBadge({
  value,
}: {
  value: TransactionStatus
}) {
  return (
    <StatusChip
      label={transactionStatusLabels[value]}
      tone={transactionStatusTone[value]}
    />
  )
}
