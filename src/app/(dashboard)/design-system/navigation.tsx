import { IconBriefcase, IconLayoutDashboard, IconUsers } from "@tabler/icons-react"

import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs"
import { ContentGrid, MetricGrid } from "@/components/layout/dashboard-grid"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { Section, Specimen, Subheading } from "./specimen"

const sidebarItems = [
  { label: "Dashboard", icon: IconLayoutDashboard, active: true },
  { label: "Clients", icon: IconUsers, active: false },
  { label: "Portfolios", icon: IconBriefcase, active: false },
]

export function NavigationSection() {
  return (
    <Section
      id="navigation"
      title="06. Navigation and layouts"
      description="The live sidebar and header wrap this page. Specimens below are the same pieces, composed in isolation."
    >
      <div className="grid gap-4 lg:grid-cols-[14rem_1fr]">
        <Specimen className="p-3">
          <Subheading>Sidebar</Subheading>
          <nav
            aria-label="Sidebar sample"
            className="mt-3 flex flex-col gap-1 text-sidebar-foreground"
          >
            {sidebarItems.map((item) => (
              <span
                key={item.label}
                className={cn(
                  "flex min-h-9 items-center gap-2 rounded-md px-2 text-sm",
                  item.active && "bg-sidebar-accent font-medium"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </span>
            ))}
          </nav>
        </Specimen>

        <div className="space-y-4">
          <Specimen className="space-y-3">
            <Subheading>Header and breadcrumbs</Subheading>
            <p className="text-sm leading-6 text-muted-foreground">
              The sticky header on this page is the real one: sidebar trigger,
              breadcrumbs, search, notifications, theme, account.
            </p>
            <AppBreadcrumbs />
          </Specimen>

          <Specimen>
            <PageHeader
              title="Growth portfolio"
              description="Aarav Mehta · marked 31 Oct 2026"
              actions={
                <>
                  <Button variant="outline">Export</Button>
                  <Button>Record transaction</Button>
                </>
              }
            />
          </Specimen>
        </div>
      </div>

      <div className="space-y-3">
        <Subheading>Dashboard grid</Subheading>
        <MetricGrid>
          <MiniMetric label="AUM" value="₹4.2 Cr" />
          <MiniMetric label="Clients" value="15" />
          <MiniMetric label="Portfolios" value="20" />
          <MiniMetric label="1Y return" value="+12.4%" />
        </MetricGrid>
        <ContentGrid>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Wide pane</CardTitle>
              <CardDescription>
                Charts span two columns from the lg breakpoint.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Side pane</CardTitle>
              <CardDescription>Allocation, lists, or a single metric.</CardDescription>
            </CardHeader>
          </Card>
        </ContentGrid>
      </div>

      <Specimen className="space-y-2">
        <Subheading>Responsive behavior</Subheading>
        <ul className="max-w-prose list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
          <li>Below 768px the sidebar becomes a sheet; the trigger stays in the header.</li>
          <li>Breadcrumb ancestors hide on small screens; the current page stays visible.</li>
          <li>Metric grids go 1 → 2 → 4 columns. Content grids go 1 → 3 at lg.</li>
          <li>Search in the header collapses to an icon button on small screens.</li>
        </ul>
      </Specimen>
    </Section>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="tabular-nums tracking-tight">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
