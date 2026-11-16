import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col items-start justify-center gap-2 px-1 py-8",
        className
      )}
    >
      <p className="text-sm font-medium text-balance">{title}</p>
      {description ? (
        <p className="max-w-prose text-sm leading-6 text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action}
    </div>
  )
}
