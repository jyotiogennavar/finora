import type { Metadata } from "next"

import { AnalyticsView } from "@/features/analytics/analytics-view"
import { getBookAnalytics } from "@/features/analytics/queries/get-book-analytics"

export const metadata: Metadata = {
  title: "Analytics",
}

export default function AnalyticsPage() {
  return <AnalyticsView data={getBookAnalytics()} />
}
