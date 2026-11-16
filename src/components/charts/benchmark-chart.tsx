"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
import type { PerformancePoint } from "@/features/analytics/types"

const config = {
  portfolio: { label: "Portfolio", color: "var(--foreground)" },
  benchmark: { label: "Benchmark", color: "var(--information)" },
} satisfies ChartConfig

function indexSeries(points: PerformancePoint[]) {
  const base = points[0]?.value ?? 100
  return points.map((point) => ({
    date: point.date,
    value: base === 0 ? 0 : (point.value / base) * 100,
  }))
}

export function BenchmarkChart({
  portfolio,
  benchmark,
  className,
}: {
  portfolio: PerformancePoint[]
  benchmark: PerformancePoint[]
  className?: string
}) {
  const reduceMotion = usePrefersReducedMotion()
  const portfolioIndexed = indexSeries(portfolio)
  const benchmarkIndexed = indexSeries(benchmark)
  const data = portfolioIndexed.map((point, index) => ({
    date: point.date,
    portfolio: point.value,
    benchmark: benchmarkIndexed[index]?.value ?? null,
  }))

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
          width={36}
          domain={[
            (dataMin: number) => Math.floor(dataMin) - 1,
            (dataMax: number) => Math.ceil(dataMax) + 1,
          ]}
          tickFormatter={(value: number) => value.toFixed(0)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatMonthTick(String(value))}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="portfolio"
          stroke="var(--color-portfolio)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={!reduceMotion}
        />
        <Line
          type="monotone"
          dataKey="benchmark"
          stroke="var(--color-benchmark)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={!reduceMotion}
        />
      </LineChart>
    </ChartContainer>
  )
}
