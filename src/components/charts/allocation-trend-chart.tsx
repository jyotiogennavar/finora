"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { formatMonthTick } from "@/lib/format/date"
import { assetClassColors, assetClassLabels } from "@/lib/format/labels"
import { formatPercent } from "@/lib/format/percent"
import type { AssetClass } from "@/types/common"
import type { AllocationTrendPoint } from "@/features/analytics/queries/get-book-analytics"

const assetClasses: AssetClass[] = [
  "EQUITY",
  "DEBT",
  "HYBRID",
  "GOLD",
  "CASH",
]

export function AllocationTrendChart({
  data,
  className,
}: {
  data: AllocationTrendPoint[]
  className?: string
}) {
  const reduceMotion = usePrefersReducedMotion()
  const active = assetClasses.filter((assetClass) =>
    data.some((point) => point[assetClass] > 0.05)
  )
  const config: ChartConfig = Object.fromEntries(
    active.map((assetClass) => [
      assetClass,
      {
        label: assetClassLabels[assetClass],
        color: assetClassColors[assetClass],
      },
    ])
  )

  return (
    <ChartContainer
      config={config}
      className={
        className ??
        "aspect-auto h-56 w-full [&_.recharts-cartesian-axis-tick_text]:tabular-nums"
      }
    >
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatMonthTick}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          domain={[0, 100]}
          tickFormatter={(value: number) =>
            formatPercent(value, 0, { signed: false })
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatMonthTick(String(value))}
              formatter={(value) =>
                formatPercent(Number(value), 1, { signed: false })
              }
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {active.map((assetClass) => (
          <Area
            key={assetClass}
            type="monotone"
            dataKey={assetClass}
            stackId="mix"
            stroke={`var(--color-${assetClass})`}
            fill={`var(--color-${assetClass})`}
            fillOpacity={0.35}
            strokeWidth={1.5}
            isAnimationActive={!reduceMotion}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}
