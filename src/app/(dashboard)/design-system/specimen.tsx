import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-balance">{title}</h2>
        {description ? (
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export function Subheading({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium">{children}</p>
}

export function Specimen({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <div className={cn("rounded-xl p-6 ring-1 ring-foreground/10", className)}>{children}</div>
}
