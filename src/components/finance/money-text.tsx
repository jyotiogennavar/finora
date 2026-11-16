"use client"

import { useWorkspaceSettings } from "@/features/settings/workspace-settings"
import {
  formatCompactInr,
  formatInr,
  formatSignedInr,
} from "@/lib/format/inr"
import { cn } from "@/lib/utils"

export function MoneyText({
  amount,
  fractionDigits = 0,
  signed = false,
  compact,
  className,
}: {
  amount: number
  fractionDigits?: number
  signed?: boolean
  compact?: boolean
  className?: string
}) {
  const preferCompact = useWorkspaceSettings().compactMoney
  const useCompact = compact ?? preferCompact
  const formatted = formatAmount(amount, fractionDigits, signed, useCompact)

  return (
    <span className={cn("tabular-nums tracking-tight", className)}>
      {formatted}
    </span>
  )
}

function formatAmount(
  amount: number,
  fractionDigits: number,
  signed: boolean,
  compact: boolean
) {
  if (!compact) {
    return signed
      ? formatSignedInr(amount, fractionDigits)
      : formatInr(amount, fractionDigits)
  }

  if (!signed || amount === 0) return formatCompactInr(amount)
  if (amount > 0) return `+${formatCompactInr(amount)}`
  return `−${formatCompactInr(Math.abs(amount))}`
}
