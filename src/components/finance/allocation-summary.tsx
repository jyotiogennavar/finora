import { MoneyText } from "@/components/finance/money-text"
import { PercentText } from "@/components/finance/percent-text"
import {
  assetClassColors,
  assetClassLabels,
} from "@/lib/format/labels"
import { cn } from "@/lib/utils"
import type { AllocationItem } from "@/features/analytics/types"

export function AllocationSummary({
  items,
  className,
}: {
  items: AllocationItem[]
  className?: string
}) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item.assetClass} className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full pointer-events-none select-none"
                style={{ backgroundColor: assetClassColors[item.assetClass] }}
                aria-hidden
              />
              {assetClassLabels[item.assetClass]}
            </span>
            <span className="flex items-center gap-3">
              <PercentText
                value={item.percentage}
                signed={false}
                tone="none"
                className="text-muted-foreground"
              />
              <MoneyText amount={item.value} className="font-medium" />
            </span>
          </div>
          <div
            className="h-1 overflow-hidden rounded-full bg-muted pointer-events-none"
            aria-hidden
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(item.percentage, 100)}%`,
                backgroundColor: assetClassColors[item.assetClass],
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
