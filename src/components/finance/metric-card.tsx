import type { ReactNode } from "react"

import { ReturnIndicator } from "@/components/finance/return-indicator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function MetricCard({
  label,
  value,
  change,
  hint,
  className,
}: {
  label: string
  value: ReactNode
  change?: number
  hint?: ReactNode
  className?: string
}) {
  return (
    <Card data-slot="metric-card" size="sm" className={cn(className)}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-xl font-semibold tabular-nums tracking-tight">
          {value}
        </CardTitle>
      </CardHeader>
      {change !== undefined || hint ? (
        <CardContent className="space-y-1">
          {change !== undefined ? <ReturnIndicator value={change} /> : null}
          {hint ? (
            <p className="text-xs leading-5 text-pretty text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  )
}
