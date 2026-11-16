import { calculatePortfolioValuation } from "@/lib/calculations/portfolio";
import {
  mockAssets,
  mockClients,
  mockHoldings,
  mockPortfolios,
  mockTransactions,
} from "@/mocks";

import type { Client } from "@/features/clients/types";
import type { Portfolio } from "@/features/portfolios/types";

export type PortfolioSnapshot = {
  portfolio: Portfolio;
  client: Client | undefined;
  metrics: ReturnType<typeof calculatePortfolioValuation>;
  stockCount: number;
  fundCount: number;
};

export function listPortfolioSnapshots(): PortfolioSnapshot[] {
  const assetsById = new Map(mockAssets.map((asset) => [asset.id, asset]));

  return mockPortfolios.map((portfolio) => {
    let stockCount = 0;
    let fundCount = 0;

    for (const holding of mockHoldings) {
      if (holding.portfolioId !== portfolio.id) continue;
      const asset = assetsById.get(holding.assetId);
      if (asset?.assetType === "STOCK") stockCount += 1;
      if (asset?.assetType === "MUTUAL_FUND") fundCount += 1;
    }

    return {
      portfolio,
      client: mockClients.find((client) => client.id === portfolio.clientId),
      metrics: calculatePortfolioValuation(
        portfolio.id,
        mockHoldings,
        mockTransactions
      ),
      stockCount,
      fundCount,
    };
  });
}
