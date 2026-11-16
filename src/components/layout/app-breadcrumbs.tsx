"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getBreadcrumbs } from "@/config/navigation"
import {
  parseAddedClients,
  useAddedClientsRaw,
  useHydrated,
} from "@/features/clients/added-clients"
import { fullName } from "@/lib/format/labels"
import { cn } from "@/lib/utils"

export function AppBreadcrumbs() {
  const pathname = usePathname()
  const hydrated = useHydrated()
  const addedRaw = useAddedClientsRaw()
  const added = hydrated ? parseAddedClients(addedRaw) : []
  const crumbs = getBreadcrumbs(pathname).map((crumb) => {
    const id = crumb.href.split("/").at(-1)
    const client = added.find((item) => item.id === id)
    if (!client) return crumb
    return { ...crumb, title: fullName(client.firstName, client.lastName) }
  })

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <Fragment key={crumb.href}>
              {index > 0 ? (
                <BreadcrumbSeparator className="hidden md:inline-flex" />
              ) : null}
              <BreadcrumbItem
                className={cn(
                  "min-w-0",
                  !isLast && "hidden md:inline-flex"
                )}
              >
                {isLast ? (
                  <BreadcrumbPage className="truncate">
                    {crumb.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="truncate"
                    render={<Link href={crumb.href} />}
                  >
                    {crumb.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
