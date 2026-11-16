import { getDashboardOverview } from "@/features/dashboard/queries/get-dashboard-overview"
import { getPortfolioSummary } from "@/features/portfolios/queries/get-portfolio-summary"
import { mockAssets } from "@/mocks/assets"
import { mockClients } from "@/mocks/clients"
import { mockHoldings } from "@/mocks/holdings"
import { mockPortfolios } from "@/mocks/portfolios"
import { mockTransactions } from "@/mocks/transactions"
import type { TransactionType } from "@/features/transactions/types"

export const overview = getDashboardOverview()

const summary = getPortfolioSummary("POR001")

if (!summary) {
  throw new Error("Expected mock portfolio POR001")
}

export const portfolio = summary

export const specimenClient = mockClients[0]

export const specimenClientAum = mockPortfolios
  .filter((item) => item.clientId === specimenClient.id)
  .reduce((total, item) => {
    const summary = getPortfolioSummary(item.id)
    return total + (summary?.metrics.currentValue ?? 0)
  }, 0)

export const specimenHoldings = mockHoldings.slice(0, 8).map((holding) => {
  const asset = mockAssets.find((item) => item.id === holding.assetId)
  const value = holding.quantity * holding.currentPrice
  const cost = holding.quantity * holding.averageBuyPrice

  return {
    id: holding.id,
    name: asset?.name ?? holding.assetId,
    symbol: asset?.symbol ?? "",
    assetClass: asset?.assetClass ?? "EQUITY",
    value,
    change: cost > 0 ? ((value - cost) / cost) * 100 : 0,
  }
})

const transactionTypes: TransactionType[] = [
  "BUY",
  "DEPOSIT",
  "WITHDRAWAL",
  "DIVIDEND",
  "INTEREST",
]

export const specimenTransactions = transactionTypes
  .map((type) => mockTransactions.find((item) => item.type === type))
  .filter((item) => item !== undefined)

export const specimenPortfolioCards = ["POR001", "POR003", "POR005"].flatMap(
  (id) => {
    const summary = getPortfolioSummary(id)
    if (!summary?.client) return []
    return [
      {
        id: summary.portfolio.id,
        name: summary.portfolio.name,
        status: summary.portfolio.status,
        client: summary.client,
        currentValue: summary.metrics.currentValue,
        returnPercentage: summary.metrics.returnPercentage,
        absoluteReturn: summary.metrics.absoluteReturn,
        holdingsCount: summary.metrics.holdingsCount,
      },
    ]
  }
)

export const specimenClientPortfolios = overview.topPortfolios.slice(0, 4).map(
  (item) => ({
    id: item.portfolioId,
    name: item.portfolioName,
    currentValue: item.currentValue,
    returnPercentage: item.returnPercentage,
  })
)

const history = portfolio.performance?.history ?? []

function rangeReturn(months: number) {
  const slice = history.slice(-Math.max(months, 2))
  const start = slice[0]?.value
  const end = slice[slice.length - 1]?.value
  if (!start || start === 0 || end === undefined) return 0
  return ((end - start) / start) * 100
}

export const specimenReturns = [
  { label: "1M", value: rangeReturn(2) },
  { label: "3M", value: rangeReturn(3) },
  { label: "6M", value: rangeReturn(6) },
  { label: "1Y", value: rangeReturn(12) },
]
