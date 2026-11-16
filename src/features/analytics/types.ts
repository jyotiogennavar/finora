import type { ID, AssetClass } from "@/types/common";

export interface Benchmark {
  id: ID;
  name: string;
  symbol: string;
  description: string;
}

export interface PerformancePoint {
  date: string;
  value: number;
}

export interface PortfolioPerformance {
  portfolioId: ID;
  period: string;

  netContributions: number;
  currentValue: number;

  absoluteReturn: number;
  absoluteReturnPercentage: number;

  annualizedReturn?: number;

  history: PerformancePoint[];
}

export interface BenchmarkPerformance {
  benchmarkId: ID;
  period: string;
  returnPercentage: number;
  history: PerformancePoint[];
}

export interface AllocationItem {
  assetClass: AssetClass;
  value: number;
  percentage: number;
}
