import type { Holding } from "@/features/portfolios/types";
import { mockPortfolios } from "./portfolios";

// Simulated reference prices in INR.
// These are development fixtures, not live market quotes.
export const mockAssetPrices: Record<string, number> = {
  AST001: 1450,
  AST002: 1720,
  AST003: 1850,
  AST004: 3950,
  AST005: 1320,
  AST006: 3650,
  AST007: 1920,
  AST008: 420,
  AST009: 850,
  AST010: 2450,

  AST011: 85,
  AST012: 950,
  AST013: 175,
  AST014: 105,
  AST015: 115,
  AST016: 245,
  AST017: 28,
  AST018: 42,
  AST019: 320,
  AST020: 185,

  AST021: 285,
  AST022: 820,
  AST023: 1250,

  AST024: 102,
  AST025: 98,
  AST026: 100,
  AST027: 100,

  AST028: 75,
  AST029: 78,
  AST030: 32,
};

// Five assets per portfolio.
// Asset IDs reference the asset master in assets.ts.
const portfolioAssetSets: string[][] = [
  ["AST001", "AST002", "AST011", "AST017", "AST028"],
  ["AST003", "AST004", "AST014", "AST023", "AST029"],
  ["AST005", "AST006", "AST013", "AST018", "AST030"],
  ["AST007", "AST008", "AST015", "AST024", "AST028"],
  ["AST009", "AST010", "AST016", "AST019", "AST029"],
  ["AST001", "AST005", "AST012", "AST025", "AST030"],
  ["AST002", "AST007", "AST020", "AST023", "AST028"],
  ["AST003", "AST008", "AST011", "AST026", "AST029"],
  ["AST004", "AST009", "AST014", "AST017", "AST030"],
  ["AST006", "AST010", "AST016", "AST021", "AST028"],
];

export const mockHoldings: Holding[] = mockPortfolios.flatMap(
  (portfolio, portfolioIndex) => {
    const assetSet = portfolioAssetSets[portfolioIndex % portfolioAssetSets.length];

    return assetSet.map((assetId, holdingIndex) => {
      const currentPrice = mockAssetPrices[assetId];

      const quantity =
        (portfolioIndex + 2) * 10 + (holdingIndex + 1) * 5;

      const purchaseFactor =
        0.88 + ((portfolioIndex + holdingIndex) % 7) * 0.025;

      const averageBuyPrice = Number(
        (currentPrice * purchaseFactor).toFixed(2)
      );

      return {
        id: `HLD${String(portfolioIndex * 5 + holdingIndex + 1).padStart(3, "0")}`,
        portfolioId: portfolio.id,
        assetId,
        quantity,
        averageBuyPrice,
        currentPrice,
        lastUpdated: "2026-10-15T15:30:00Z",
      };
    });
  }
);
