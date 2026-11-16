import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function MetricGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {children}
    </div>
  )
}

export function ContentGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid gap-4 lg:grid-cols-3", className)}>
      {children}
    </div>
  )
}
