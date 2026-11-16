import {
  IconArrowsLeftRight,
  IconBriefcase,
  IconChartLine,
  IconLayoutDashboard,
  IconPalette,
  IconSettings,
  IconUsers,
  type Icon,
} from "@tabler/icons-react"

import { getClientProfile } from "@/features/clients/queries/get-client-profile"
import { getPortfolioSummary } from "@/features/portfolios/queries/get-portfolio-summary"
import { fullName } from "@/lib/format/labels"

export type NavItem = {
  title: string
  href: string
  icon: Icon
}

export type NavSection = {
  id: string
  label?: string
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    id: "workspace",
    items: [
      { title: "Dashboard", href: "/", icon: IconLayoutDashboard },
      { title: "Clients", href: "/clients", icon: IconUsers },
      { title: "Portfolios", href: "/portfolios", icon: IconBriefcase },
      {
        title: "Transactions",
        href: "/transactions",
        icon: IconArrowsLeftRight,
      },
      { title: "Analytics", href: "/analytics", icon: IconChartLine },
      { title: "Settings", href: "/settings", icon: IconSettings },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    items: [
      { title: "Design system", href: "/design-system", icon: IconPalette },
    ],
  },
]

export type Breadcrumb = {
  title: string
  href: string
}

const itemsByHref = new Map(
  navigation.flatMap((section) => section.items).map((item) => [item.href, item])
)

export function isNavItemActive(pathname: string, href: string) {
  const current = normalizePathname(pathname)
  if (href === "/") return current === "/"
  return current === href || current.startsWith(`${href}/`)
}

export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  const current = normalizePathname(pathname)
  const home = itemsByHref.get("/")
  const crumbs: Breadcrumb[] = [
    { title: home?.title ?? "Dashboard", href: "/" },
  ]

  const segments = current.split("/").filter(Boolean)
  let href = ""

  for (const segment of segments) {
    href += `/${segment}`
    const known = itemsByHref.get(href)
    crumbs.push({
      title: known?.title ?? segmentTitle(href, segment),
      href,
    })
  }

  return crumbs
}

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1)
  }
  return pathname
}

function segmentTitle(href: string, segment: string) {
  if (href.startsWith("/clients/")) {
    const profile = getClientProfile(segment)
    if (profile) {
      return fullName(profile.client.firstName, profile.client.lastName)
    }
  }

  if (href.startsWith("/portfolios/")) {
    const summary = getPortfolioSummary(segment)
    if (summary) return summary.portfolio.name
  }

  return formatSegment(segment)
}

function formatSegment(segment: string) {
  let decoded = segment
  try {
    decoded = decodeURIComponent(segment)
  } catch {
    decoded = segment
  }

  return decoded
    .replace(/[-_]/g, " ")
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}
