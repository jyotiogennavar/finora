"use client"

import { Cell, Pie, PieChart } from "recharts"

import { PercentText } from "@/components/finance/percent-text"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import {
  assetClassColors,
  assetClassLabels,
} from "@/lib/format/labels"
import type { AllocationItem } from "@/features/analytics/types"

export function AllocationChart({
  items,
  className,
}: {
  items: AllocationItem[]
  className?: string
}) {
  const reduceMotion = usePrefersReducedMotion()
  const config: ChartConfig = Object.fromEntries(
    items.map((item) => [
      item.assetClass,
      {
        label: assetClassLabels[item.assetClass],
        color: assetClassColors[item.assetClass],
      },
    ])
  )

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <ChartContainer
          config={config}
          className="aspect-square h-40 w-40"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent nameKey="assetClass" hideLabel />
              }
            />
            <Pie
              data={items}
              dataKey="percentage"
              nameKey="assetClass"
              innerRadius={48}
              outerRadius={72}
              stroke="var(--background)"
              strokeWidth={2}
              isAnimationActive={!reduceMotion}
            >
              {items.map((item) => (
                <Cell
                  key={item.assetClass}
                  fill={`var(--color-${item.assetClass})`}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <ul className="w-full space-y-2 text-sm">
          {items.map((item) => (
            <li
              key={item.assetClass}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full pointer-events-none select-none"
                  style={{ backgroundColor: assetClassColors[item.assetClass] }}
                  aria-hidden
                />
                {assetClassLabels[item.assetClass]}
              </span>
              <PercentText
                value={item.percentage}
                signed={false}
                tone="none"
                className="text-muted-foreground"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
