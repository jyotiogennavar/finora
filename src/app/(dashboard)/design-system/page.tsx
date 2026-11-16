import type { Metadata } from "next"

import { ComponentGallery } from "@/app/(dashboard)/design-system/component-gallery"
import { PageHeader } from "@/components/layout/page-header"

export const metadata: Metadata = {
  title: "Design system",
}

const colors = [
  { name: "Background", variable: "--background" },
  { name: "Foreground", variable: "--foreground" },
  { name: "Card", variable: "--card" },
  { name: "Muted", variable: "--muted" },
  { name: "Muted foreground", variable: "--muted-foreground" },
  { name: "Primary", variable: "--primary" },
  { name: "Secondary", variable: "--secondary" },
  { name: "Accent", variable: "--accent" },
  { name: "Destructive", variable: "--destructive" },
  { name: "Success", variable: "--success" },
  { name: "Border", variable: "--border" },
]

const componentColors = [
  { name: "Positive", variable: "--positive" },
  { name: "Negative", variable: "--negative" },
  { name: "Information", variable: "--information" },
  { name: "Neutral", variable: "--neutral" },
  { name: "Active", variable: "--active" },
  { name: "Pending", variable: "--pending" },
  { name: "Overdue", variable: "--overdue" },
]

const toc = [
  { href: "#typography", label: "Type" },
  { href: "#colors", label: "Color" },
  { href: "#buttons", label: "Buttons" },
  { href: "#financial-ui", label: "Financial UI" },
  { href: "#data-display", label: "Data" },
  { href: "#charts", label: "Charts" },
  { href: "#navigation", label: "Layout" },
  { href: "#interactions", label: "Interactions" },
  { href: "#polish", label: "Polish" },
]

export default function DesignSystemPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        title="Design system"
        description="Foundations and the product components used across Finora. Specimens use the simulated book, not live market data."
      />

      <nav aria-label="On this page">
        <ul className="flex flex-wrap gap-2">
          {toc.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-flex h-9 items-center rounded-lg bg-muted px-2.5 text-sm text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="typography" className="scroll-mt-24 space-y-6">
        <h2 className="text-xl font-semibold">01. Typography</h2>

        <div className="space-y-4 rounded-xl p-6 ring-1 ring-foreground/10">
          <div>
            <p className="text-xs text-muted-foreground">Display / 24px</p>
            <p className="text-2xl font-semibold tracking-tight text-balance">
              Portfolio Overview
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Heading / 24px</p>
            <p className="text-2xl font-semibold">Client Performance</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Subheading / 18px</p>
            <p className="text-lg font-medium">Asset Allocation</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Body / 14px</p>
            <p className="max-w-prose text-sm leading-6">
              Monitor portfolio performance across all your clients.
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Caption / 12px</p>
            <p className="text-xs text-muted-foreground">
              Last updated 13 Nov 2026
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-xl p-6 ring-1 ring-foreground/10">
          <p className="text-sm font-medium">Financial typography</p>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            ₹1,24,50,000
          </p>
          <div className="flex flex-wrap gap-8">
            <p className="text-sm font-medium tabular-nums text-positive">
              +12.45%
            </p>
            <p className="text-sm font-medium tabular-nums text-negative">
              −3.25%
            </p>
            <p className="text-sm font-medium tabular-nums">1,245.67</p>
          </div>
        </div>
      </section>

      <section id="colors" className="scroll-mt-24 space-y-6">
        <h2 className="text-xl font-semibold">02. Colors</h2>

        <div className="space-y-3">
          <p className="text-sm font-medium">Surfaces and borders</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {colors.map((color) => (
              <ColorSwatch key={color.variable} {...color} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Semantic</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {componentColors.map((color) => (
              <ColorSwatch key={color.variable} {...color} />
            ))}
          </div>
        </div>
      </section>

      <ComponentGallery />
    </div>
  )
}

function ColorSwatch({ name, variable }: { name: string; variable: string }) {
  return (
    <div className="space-y-2">
      <div
        className="h-16 rounded-md ring-1 ring-foreground/10"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <p className="text-sm font-medium">{name}</p>
      <p className="font-mono text-xs text-muted-foreground">{variable}</p>
    </div>
  )
}
