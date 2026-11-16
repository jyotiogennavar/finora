"use client"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import { useIsMobile } from "@/hooks/use-mobile"

import { Section, Specimen, Subheading } from "./specimen"

const typeScale = [
  { role: "Page title", className: "text-2xl font-semibold tracking-tight", sample: "Portfolio overview" },
  { role: "Section", className: "text-xl font-semibold", sample: "Asset allocation" },
  { role: "Card title", className: "text-base font-medium", sample: "Growth portfolio" },
  { role: "Body", className: "text-sm leading-6", sample: "Monitor performance across every mandate you advise." },
  { role: "Caption", className: "text-xs text-muted-foreground", sample: "Marked 31 Oct 2026" },
  { role: "Metric", className: "text-2xl font-semibold tabular-nums tracking-tight", sample: "₹1,24,50,000" },
]

const spacing = [
  { token: "gap-2 / p-2", use: "Inline clusters, table cells" },
  { token: "gap-3 / p-3", use: "Compact toolbars and sidebar rows" },
  { token: "gap-4 / p-4", use: "Card padding, grid gaps" },
  { token: "p-6", use: "Specimens and isolated examples" },
  { token: "space-y-12", use: "Distance between page sections" },
]

export function PolishSection() {
  const isMobile = useIsMobile()

  return (
    <Section
      id="polish"
      title="08. Final polish"
      description="Theme, type, space, and the accessibility floor. These are constraints, not a later pass."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Subheading>Light and dark</Subheading>
            <p className="max-w-prose text-sm leading-6 text-muted-foreground">
              Tokens flip under <code className="font-mono text-xs">.dark</code>.
              Charts, badges, and returns follow the same variables. Prefer
              system until the user picks.
            </p>
          </div>
          <ThemeToggle />
        </Specimen>

        <Specimen className="space-y-2">
          <Subheading>Responsive testing</Subheading>
          <p className="text-sm leading-6 text-muted-foreground">
            This viewport is{" "}
            <span className="font-medium text-foreground">
              {isMobile ? "below 768px" : "768px or wider"}
            </span>
            . Resize until the sidebar becomes a sheet and the metric grid
            drops from four columns to two, then one.
          </p>
        </Specimen>
      </div>

      <Specimen className="space-y-4">
        <Subheading>Typography</Subheading>
        <ul className="space-y-3">
          {typeScale.map((item) => (
            <li key={item.role} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:items-baseline">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                {item.role}
              </p>
              <p className={item.className}>{item.sample}</p>
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen className="space-y-3">
        <Subheading>Spacing</Subheading>
        <ul className="divide-y text-sm">
          {spacing.map((item) => (
            <li
              key={item.token}
              className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <code className="font-mono text-xs">{item.token}</code>
              <span className="text-muted-foreground">{item.use}</span>
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen className="space-y-4">
        <Subheading>Accessibility</Subheading>
        <ul className="max-w-prose list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          <li>
            A skip link is the first tab stop on dashboard pages. Tab from the
            address bar to reach it.
          </li>
          <li>
            Returns use color, a signed number, and an icon. Status never relies
            on hue alone.
          </li>
          <li>
            Inputs stay at 16px on small screens. Labels are wired with{" "}
            <code className="font-mono text-xs">htmlFor</code>. Errors sit next
            to the field and set <code className="font-mono text-xs">aria-invalid</code>.
          </li>
          <li>
            Focus rings stay the default ring token — grey, not brand-colored.
            Motion stops under{" "}
            <code className="font-mono text-xs">prefers-reduced-motion</code>.
          </li>
        </ul>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Focus this</Button>
          <ReturnIndicator value={12.45} size="md" />
          <ReturnIndicator value={-3.25} size="md" />
        </div>
      </Specimen>
    </Section>
  )
}
