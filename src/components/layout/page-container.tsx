"use client"

import type { ComponentProps } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function PageContainer({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  const pathname = usePathname()
  const wide =
    pathname === "/" ||
    pathname === "/analytics" ||
    pathname === "/transactions"

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col px-4 py-4 md:px-6",
        wide ? "max-w-none" : "mx-auto max-w-6xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
