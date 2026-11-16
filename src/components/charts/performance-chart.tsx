"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { formatMonthTick } from "@/lib/format/date"
import { formatCompactInr } from "@/lib/format/inr"
import type { PerformancePoint } from "@/features/analytics/types"

const config = {
  value: { label: "Portfolio", color: "var(--foreground)" },
} satisfies ChartConfig

export function PerformanceChart({
  data,
  className,
}: {
  data: PerformancePoint[]
  className?: string
}) {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <ChartContainer
      config={config}
      className={
        className ??
        "aspect-auto h-56 [&_.recharts-cartesian-axis-tick_text]:tabular-nums"
      }
    >
      <LineChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
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
          width={72}
          domain={["auto", "auto"]}
          tickFormatter={(value: number) => formatCompactInr(value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatMonthTick(String(value))}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={!reduceMotion}
        />
      </LineChart>
    </ChartContainer>
  )
}
