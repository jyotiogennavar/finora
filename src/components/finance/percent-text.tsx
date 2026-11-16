import { formatPercent } from "@/lib/format/percent"
import { cn } from "@/lib/utils"

export function PercentText({
  value,
  signed = true,
  tone = "auto",
  fractionDigits = 2,
  className,
}: {
  value: number
  signed?: boolean
  tone?: "auto" | "none"
  fractionDigits?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        "tabular-nums",
        tone === "auto" && value > 0 && "text-positive",
        tone === "auto" && value < 0 && "text-negative",
        className
      )}
    >
      {formatPercent(value, fractionDigits, { signed })}
    </span>
  )
}
