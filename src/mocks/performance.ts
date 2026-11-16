import type {
  BenchmarkPerformance,
  PerformancePoint,
  PortfolioPerformance,
} from "@/features/analytics/types";

import { calculatePortfolioValuation } from "@/lib/calculations/portfolio";

import { mockHoldings } from "./holdings";
import { mockPortfolios } from "./portfolios";
import { mockTransactions } from "./transactions";

const HISTORY_LENGTH = 12;

function getMonthlyDates(): string[] {
  return Array.from({ length: HISTORY_LENGTH }, (_, index) => {
    const date = new Date(Date.UTC(2025, 10 + index + 1, 0));

    return date.toISOString().slice(0, 10);
  });
}

const historyDates = getMonthlyDates();

function generateHistory(
  startValue: number,
  endValue: number,
  phase: number
): PerformancePoint[] {
  return historyDates.map((date, index) => {
    const progress = index / (HISTORY_LENGTH - 1);

    const baseValue = startValue + (endValue - startValue) * progress;

    const variation =
      Math.abs(endValue - startValue) *
      0.025 *
      Math.sin(progress * Math.PI) *
      Math.sin(index * 1.4 + phase);

    const value =
      index === HISTORY_LENGTH - 1
        ? endValue
        : Math.max(0, baseValue + variation);

    return {
      date,
      value: Number(value.toFixed(2)),
    };
  });
}

// Portfolio histories are simulated paths ending at calculated
// current valuations. They are not reconstructed from historical trades.
export const mockPortfolioPerformance: PortfolioPerformance[] =
  mockPortfolios.map((portfolio, index) => {
    const metrics = calculatePortfolioValuation(
      portfolio.id,
      mockHoldings,
      mockTransactions
    );

    const returnFactor = 1 + metrics.returnPercentage / 100;

    const startValue =
      returnFactor > 0
        ? metrics.currentValue / returnFactor
        : metrics.currentValue;

    return {
      portfolioId: portfolio.id,
      period: "1Y",
      netContributions: metrics.netContributions,
      currentValue: metrics.currentValue,
      absoluteReturn: metrics.absoluteReturn,
      absoluteReturnPercentage: metrics.returnPercentage,
      history: generateHistory(startValue, metrics.currentValue, index + 1),
    };
  });

// Simulated one-year benchmark returns.
// Values are illustrative and are not historical market performance.
const benchmarkReturnSeeds = [
  { benchmarkId: "BMK001", returnPercentage: 11.8 },
  { benchmarkId: "BMK002", returnPercentage: 10.6 },
  { benchmarkId: "BMK003", returnPercentage: 13.4 },
  { benchmarkId: "BMK004", returnPercentage: 6.2 },
];

export const mockBenchmarkPerformance: BenchmarkPerformance[] =
  benchmarkReturnSeeds.map((benchmark, index) => ({
    benchmarkId: benchmark.benchmarkId,
    period: "1Y",
    returnPercentage: benchmark.returnPercentage,
    history: generateHistory(
      100,
      100 * (1 + benchmark.returnPercentage / 100),
      index + 10
    ),
  }));
