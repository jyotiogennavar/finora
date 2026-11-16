import type { Metadata } from "next"

import { SettingsView } from "@/features/settings/settings-view"
import { mockBenchmarks } from "@/mocks"

export const metadata: Metadata = {
  title: "Settings",
}

export default function SettingsPage() {
  return (
    <SettingsView
      benchmarks={mockBenchmarks.map((benchmark) => ({
        id: benchmark.id,
        name: benchmark.name,
        symbol: benchmark.symbol,
      }))}
    />
  )
}
