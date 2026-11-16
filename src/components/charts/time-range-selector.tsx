"use client"

import { cn } from "@/lib/utils"

export const timeRanges = ["1M", "3M", "6M", "1Y"] as const

export type TimeRange = (typeof timeRanges)[number]

const monthCount: Record<TimeRange, number> = {
  "1M": 2,
  "3M": 3,
  "6M": 6,
  "1Y": 12,
}

export function sliceByTimeRange<T>(points: T[], range: TimeRange): T[] {
  const count = monthCount[range]
  return points.slice(-Math.max(count, 1))
}

export function TimeRangeSelector({
  value,
  onChange,
  className,
  labelledBy,
}: {
  value: TimeRange
  onChange: (value: TimeRange) => void
  className?: string
  labelledBy?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={labelledBy ? undefined : "Time range"}
      aria-labelledby={labelledBy}
      className={cn(
        "inline-flex h-10 select-none items-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {timeRanges.map((range) => {
        const selected = range === value
        return (
          <button
            key={range}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cn(
              "relative h-8 min-w-10 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium outline-none transition-[color,background-color,transform] duration-150 ease-out before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] active:scale-[0.96] focus-visible:ring-3 focus-visible:ring-ring/50",
              selected
                ? "bg-background text-foreground"
                : "[@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
            )}
            onClick={() => onChange(range)}
          >
            {range}
          </button>
        )
      })}
    </div>
  )
}
