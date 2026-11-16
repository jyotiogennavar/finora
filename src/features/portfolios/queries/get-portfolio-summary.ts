import {
  mockAssets,
  mockClients,
  mockPortfolios,
  mockHoldings,
  mockTransactions,
  mockBenchmarks,
  mockPortfolioPerformance,
  mockBenchmarkPerformance,
} from "@/mocks";

import { calculatePortfolioValuation } from "@/lib/calculations/portfolio";
import { calculateAllocation } from "@/lib/calculations/allocation";
import { calculateReturnPercentage } from "@/lib/calculations/returns";
import type { AssetType } from "@/features/portfolios/types";

export function getPortfolioSummary(portfolioId: string) {
  const portfolio = mockPortfolios.find((item) => item.id === portfolioId);

  if (!portfolio) return null;

  const client = mockClients.find((item) => item.id === portfolio.clientId);

  const holdings = mockHoldings.filter(
    (item) => item.portfolioId === portfolioId
  );

  const transactions = mockTransactions
    .filter((item) => item.portfolioId === portfolioId)
    .sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    );

  const metrics = calculatePortfolioValuation(
    portfolioId,
    mockHoldings,
    mockTransactions
  );

  const allocation = calculateAllocation(
    holdings,
    mockAssets,
    metrics.cashBalance
  );

  const benchmark = mockBenchmarks.find(
    (item) => item.id === portfolio.benchmarkId
  );

  const performance = mockPortfolioPerformance.find(
    (item) => item.portfolioId === portfolioId
  );

  const benchmarkPerformance = mockBenchmarkPerformance.find(
    (item) => item.benchmarkId === portfolio.benchmarkId
  );

  const benchmarkComparison =
    performance && benchmarkPerformance
      ? {
          portfolioReturn: performance.absoluteReturnPercentage,
          benchmarkReturn: benchmarkPerformance.returnPercentage,
          outperformance:
            performance.absoluteReturnPercentage -
            benchmarkPerformance.returnPercentage,
        }
      : null;

  return {
    portfolio,
    client,
    metrics,
    holdings,
    allocation,
    benchmark,
    performance,
    benchmarkPerformance,
    benchmarkComparison,
    recentTransactions: transactions.slice(0, 10),
  };
}

export type HoldingBreakdown = {
  id: string;
  name: string;
  symbol: string;
  assetType: AssetType;
  quantity: number;
  value: number;
  returnPercentage: number;
};

export function getPortfolioDetail(portfolioId: string) {
  const summary = getPortfolioSummary(portfolioId);
  if (!summary) return null;

  const holdingRows = summary.holdings.flatMap((holding) => {
    const asset = mockAssets.find((item) => item.id === holding.assetId);
    if (!asset) return [];

    return [
      {
        id: holding.id,
        name: asset.name,
        symbol: asset.symbol,
        assetType: asset.assetType,
        quantity: holding.quantity,
        value: holding.quantity * holding.currentPrice,
        returnPercentage: calculateReturnPercentage(
          holding.currentPrice,
          holding.averageBuyPrice
        ),
      },
    ];
  });

  return {
    ...summary,
    holdingRows,
    stockCount: holdingRows.filter((row) => row.assetType === "STOCK").length,
    fundCount: holdingRows.filter((row) => row.assetType === "MUTUAL_FUND")
      .length,
  };
}
