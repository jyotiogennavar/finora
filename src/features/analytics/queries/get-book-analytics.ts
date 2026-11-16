import type {
  AllocationItem,
  PerformancePoint,
} from "@/features/analytics/types"
import type { AssetClass, RiskProfile } from "@/types/common"
import { priceAsOf } from "@/constants/market"
import { calculateAllocation } from "@/lib/calculations/allocation"
import { calculatePortfolioValuation } from "@/lib/calculations/portfolio"
import { calculateAnnualizedReturn } from "@/lib/calculations/returns"
import { calculateXirr, type CashFlow } from "@/lib/calculations/xirr"
import {
  mockAssets,
  mockBenchmarkPerformance,
  mockBenchmarks,
  mockClients,
  mockHoldings,
  mockPortfolioPerformance,
  mockPortfolios,
  mockTransactions,
} from "@/mocks"

const assetClasses: AssetClass[] = [
  "EQUITY",
  "DEBT",
  "HYBRID",
  "GOLD",
  "CASH",
]

export type AllocationTrendPoint = {
  date: string
  EQUITY: number
  DEBT: number
  HYBRID: number
  GOLD: number
  CASH: number
}

export type ClientPerformanceRow = {
  id: string
  firstName: string
  lastName: string
  clientCode: string
  riskProfile: RiskProfile
  aum: number
  contributions: number
  absoluteReturn: number
  returnPercentage: number
  xirr: number | null
}

export type BenchmarkSeries = {
  id: string
  name: string
  symbol: string
  description: string
  returnPercentage: number
  history: PerformancePoint[]
}

export type BookAnalytics = {
  aum: number
  contributions: number
  absoluteReturn: number
  returnPercentage: number
  xirr: number | null
  annualizedReturn: number
  firstContributionDate: string | null
  aumHistory: PerformancePoint[]
  allocation: AllocationItem[]
  allocationTrend: AllocationTrendPoint[]
  clients: ClientPerformanceRow[]
  benchmarks: BenchmarkSeries[]
}

function externalFlows(portfolioIds: Set<string>, terminal: number): CashFlow[] {
  const flows: CashFlow[] = []

  for (const transaction of mockTransactions) {
    if (transaction.status !== "COMPLETED") continue
    if (!portfolioIds.has(transaction.portfolioId)) continue
    if (transaction.type === "DEPOSIT") {
      flows.push({
        date: transaction.transactionDate,
        amount: -transaction.amount,
      })
    } else if (transaction.type === "WITHDRAWAL") {
      flows.push({
        date: transaction.transactionDate,
        amount: transaction.amount,
      })
    }
  }

  if (terminal !== 0) {
    flows.push({ date: priceAsOf, amount: terminal })
  }

  return flows
}

function firstContribution(flows: CashFlow[]) {
  const invested = flows.filter((flow) => flow.amount < 0).map((flow) => flow.date)
  invested.sort()
  return invested[0]?.slice(0, 10) ?? null
}

function buildAllocationTrend(
  current: AllocationItem[],
  dates: string[]
): AllocationTrendPoint[] {
  const currentPct = Object.fromEntries(
    assetClasses.map((assetClass) => [assetClass, 0])
  ) as Record<AssetClass, number>

  for (const item of current) {
    currentPct[item.assetClass] = item.percentage
  }

  const start = { ...currentPct }
  const largest = assetClasses.reduce((best, assetClass) =>
    currentPct[assetClass] > currentPct[best] ? assetClass : best
  )
  const shift = Math.min(8, start[largest] / 4)
  start[largest] -= shift
  const receiver = largest === "CASH" ? "DEBT" : "CASH"
  start[receiver] += shift

  return dates.map((date, index) => {
    const progress = dates.length <= 1 ? 1 : index / (dates.length - 1)
    const point = { date } as AllocationTrendPoint
    let total = 0

    for (const assetClass of assetClasses) {
      const value =
        index === dates.length - 1
          ? currentPct[assetClass]
          : start[assetClass] +
            (currentPct[assetClass] - start[assetClass]) * progress
      point[assetClass] = value
      total += value
    }

    if (total > 0 && index !== dates.length - 1) {
      for (const assetClass of assetClasses) {
        point[assetClass] = Number(((point[assetClass] / total) * 100).toFixed(2))
      }
    } else {
      for (const assetClass of assetClasses) {
        point[assetClass] = Number(point[assetClass].toFixed(2))
      }
    }

    return point
  })
}

export function getBookAnalytics(): BookAnalytics {
  const portfolioMetrics = mockPortfolios.map((portfolio) => ({
    portfolio,
    metrics: calculatePortfolioValuation(
      portfolio.id,
      mockHoldings,
      mockTransactions
    ),
  }))

  const aum = portfolioMetrics.reduce(
    (total, item) => total + item.metrics.currentValue,
    0
  )
  const contributions = portfolioMetrics.reduce(
    (total, item) => total + item.metrics.netContributions,
    0
  )
  const absoluteReturn = portfolioMetrics.reduce(
    (total, item) => total + item.metrics.absoluteReturn,
    0
  )
  const cash = portfolioMetrics.reduce(
    (total, item) => total + item.metrics.cashBalance,
    0
  )
  const returnPercentage = contributions > 0 ? (absoluteReturn / contributions) * 100 : 0

  const bookIds = new Set(mockPortfolios.map((portfolio) => portfolio.id))
  const bookFlows = externalFlows(bookIds, aum)
  const firstContributionDate = firstContribution(bookFlows)
  const xirr = calculateXirr(bookFlows)
  const annualizedReturn = firstContributionDate
    ? calculateAnnualizedReturn(aum, contributions, firstContributionDate, priceAsOf)
    : 0

  const aumHistory = Array.from({ length: 12 }, (_, index) => {
    const value = mockPortfolioPerformance.reduce(
      (total, performance) => total + (performance.history[index]?.value ?? 0),
      0
    )
    return {
      date: mockPortfolioPerformance[0]?.history[index]?.date ?? "",
      value: Number(value.toFixed(2)),
    }
  }).filter((point) => point.date)

  const allocation = calculateAllocation(mockHoldings, mockAssets, cash)
  const allocationTrend = buildAllocationTrend(
    allocation,
    aumHistory.map((point) => point.date)
  )

  const clients = mockClients.flatMap((client) => {
    const owned = portfolioMetrics.filter(
      (item) => item.portfolio.clientId === client.id
    )
    if (owned.length === 0) return []

    const clientAum = owned.reduce(
      (total, item) => total + item.metrics.currentValue,
      0
    )
    const clientContributions = owned.reduce(
      (total, item) => total + item.metrics.netContributions,
      0
    )
    const clientReturn = owned.reduce(
      (total, item) => total + item.metrics.absoluteReturn,
      0
    )
    const ids = new Set(owned.map((item) => item.portfolio.id))

    return [
      {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        clientCode: client.clientCode,
        riskProfile: client.riskProfile,
        aum: clientAum,
        contributions: clientContributions,
        absoluteReturn: clientReturn,
        returnPercentage:
          clientContributions > 0 ? (clientReturn / clientContributions) * 100 : 0,
        xirr: calculateXirr(externalFlows(ids, clientAum)),
      },
    ]
  })

  clients.sort((a, b) => b.returnPercentage - a.returnPercentage)

  const performanceByBenchmark = new Map(
    mockBenchmarkPerformance.map((series) => [series.benchmarkId, series])
  )

  const benchmarks = mockBenchmarks.flatMap((benchmark) => {
    const series = performanceByBenchmark.get(benchmark.id)
    if (!series) return []
    return [
      {
        id: benchmark.id,
        name: benchmark.name,
        symbol: benchmark.symbol,
        description: benchmark.description,
        returnPercentage: series.returnPercentage,
        history: series.history,
      },
    ]
  })

  return {
    aum,
    contributions,
    absoluteReturn,
    returnPercentage,
    xirr,
    annualizedReturn,
    firstContributionDate,
    aumHistory,
    allocation,
    allocationTrend,
    clients,
    benchmarks,
  }
}
