import type { Metadata } from "next"

import { PortfolioDirectory } from "@/features/portfolios/portfolio-directory"
import { getPortfolioDirectory } from "@/features/portfolios/queries/get-portfolio-directory"

export const metadata: Metadata = {
  title: "Portfolios",
}

export default function PortfoliosPage() {
  return <PortfolioDirectory rows={getPortfolioDirectory()} />
}
