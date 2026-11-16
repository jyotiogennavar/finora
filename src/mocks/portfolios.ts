import type { Portfolio } from "@/features/portfolios/types";

const portfolioSeeds = [
  ["CLI001", "Growth Portfolio", "BMK001"],
  ["CLI001", "Retirement Portfolio", "BMK002"],
  ["CLI002", "Core Investments", "BMK001"],
  ["CLI002", "Equity Portfolio", "BMK003"],
  ["CLI003", "Income & Stability", "BMK004"],
  ["CLI003", "Long-term Savings", "BMK001"],
  ["CLI004", "Balanced Wealth", "BMK002"],
  ["CLI004", "Equity Growth", "BMK003"],
  ["CLI005", "Aggressive Growth", "BMK003"],
  ["CLI005", "Wealth Preservation", "BMK004"],
  ["CLI006", "Core Portfolio", "BMK001"],
  ["CLI007", "Equity Opportunities", "BMK003"],
  ["CLI008", "Balanced Investments", "BMK002"],
  ["CLI009", "Retirement Income", "BMK004"],
  ["CLI010", "Long-term Wealth", "BMK001"],
  ["CLI011", "Growth & Income", "BMK003"],
  ["CLI012", "Conservative Wealth", "BMK004"],
  ["CLI013", "Equity Growth", "BMK003"],
  ["CLI014", "Core Investments", "BMK001"],
  ["CLI015", "Retirement Portfolio", "BMK004"],
] as const;

export const mockPortfolios: Portfolio[] = portfolioSeeds.map(
  ([clientId, name, benchmarkId], index) => ({
    id: `POR${String(index + 1).padStart(3, "0")}`,
    portfolioCode: `FIN-P${String(index + 1).padStart(4, "0")}`,
    clientId,
    name,
    benchmarkId,
    status: "ACTIVE",
    createdAt: `2024-0${(index % 6) + 1}-15T10:00:00Z`,
    updatedAt: "2026-10-15T10:00:00Z",
  })
);
