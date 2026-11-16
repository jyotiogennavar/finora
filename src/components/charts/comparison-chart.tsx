"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { formatPercent } from "@/lib/format/percent"

export type ComparisonBar = {
  label: string
  value: number
}

const config = {
  value: { label: "Return", color: "var(--foreground)" },
} satisfies ChartConfig

export function ComparisonChart({
  data,
  className,
}: {
  data: ComparisonBar[]
  className?: string
}) {
  const reduceMotion = usePrefersReducedMotion()
  const ordered = [...data].sort((a, b) => a.value - b.value)

  return (
    <ChartContainer
      config={config}
      style={{ height: Math.max(240, ordered.length * 32) }}
      className={
        className ??
        "aspect-auto w-full [&_.recharts-cartesian-axis-tick_text]:tabular-nums"
      }
    >
      <BarChart
        data={ordered}
        layout="vertical"
        margin={{ left: 4, right: 16, top: 8, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => formatPercent(value, 0)}
          domain={[
            (dataMin: number) => Math.min(0, dataMin),
            (dataMax: number) => Math.max(0, dataMax),
          ]}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={128}
          interval={0}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatPercent(Number(value), 2)}
            />
          }
        />
        <Bar dataKey="value" radius={4} barSize={14} isAnimationActive={!reduceMotion}>
          {ordered.map((item) => (
            <Cell
              key={item.label}
              fill={item.value >= 0 ? "var(--positive)" : "var(--negative)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
