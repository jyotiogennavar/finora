import {
  IconMinus,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"

import { formatPercent } from "@/lib/format/percent"
import { cn } from "@/lib/utils"

export function ReturnIndicator({
  value,
  size = "sm",
  className,
}: {
  value: number
  size?: "sm" | "md"
  className?: string
}) {
  const tone = value > 0 ? "positive" : value < 0 ? "negative" : "flat"
  const Icon =
    tone === "positive"
      ? IconTrendingUp
      : tone === "negative"
        ? IconTrendingDown
        : IconMinus

  return (
    <span
      data-slot="return-indicator"
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap font-medium tabular-nums",
        size === "sm" ? "text-xs" : "text-sm",
        tone === "positive" && "text-positive",
        tone === "negative" && "text-negative",
        tone === "flat" && "text-muted-foreground",
        className
      )}
    >
      <Icon
        className={cn(
          "pointer-events-none",
          size === "sm" ? "size-3.5" : "size-4"
        )}
        aria-hidden
      />
      {formatPercent(value)}
    </span>
  )
}
