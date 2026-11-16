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

export type ReturnBar = {
  label: string
  value: number
}

const config = {
  value: { label: "Return", color: "var(--foreground)" },
} satisfies ChartConfig

export function ReturnsChart({
  data,
  className,
}: {
  data: ReturnBar[]
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
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={(value: number) => formatPercent(value, 0)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={4} isAnimationActive={!reduceMotion}>
          {data.map((item) => (
            <Cell
              key={item.label}
              fill={
                item.value >= 0 ? "var(--positive)" : "var(--negative)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
