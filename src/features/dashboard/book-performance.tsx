"use client"

import { PerformanceChart } from "@/components/charts/performance-chart"
import {
  sliceByTimeRange,
  TimeRangeSelector,
} from "@/components/charts/time-range-selector"
import { useChartRange } from "@/features/settings/workspace-settings"
import { EmptyState } from "@/components/data/empty-state"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import type { PerformancePoint } from "@/features/analytics/types"

export function BookPerformance({
  data,
  className,
  title = "Portfolio performance",
  description = "Total value across portfolios",
  emptyDescription = "Value will chart once two month-ends are on the book.",
}: {
  data: PerformancePoint[]
  className?: string
  title?: string
  description?: string
  emptyDescription?: string
}) {
  const [range, setRange] = useChartRange()
  const points = sliceByTimeRange(data, range)
  const start = points[0]?.value
  const end = points[points.length - 1]?.value
  const change =
    points.length >= 2 && start !== undefined && end !== undefined && start !== 0
      ? ((end - start) / start) * 100
      : null

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="space-y-1">
              <h2 className="font-heading text-base leading-snug font-medium text-balance">
                {title}
              </h2>
              <p className="text-sm text-pretty text-muted-foreground">
                {description}
              </p>
            </div>
            {change !== null ? (
              <div className="flex flex-wrap items-center gap-2">
                <ReturnIndicator value={change} size="md" />
                <span className="text-xs text-muted-foreground">
                  over this range
                </span>
              </div>
            ) : null}
          </div>
          <TimeRangeSelector
            value={range}
            onChange={setRange}
            className="self-start"
          />
        </div>
      </CardHeader>
      <CardContent>
        {points.length < 2 ? (
          <EmptyState
            title="Not enough history"
            description={emptyDescription}
          />
        ) : (
          <PerformanceChart data={points} />
        )}
      </CardContent>
    </Card>
  )
}
