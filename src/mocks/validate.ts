import { mockAssets } from "./assets";
import { mockClients } from "./clients";
import { mockHoldings, mockAssetPrices } from "./holdings";
import { mockPortfolios } from "./portfolios";
import { mockTransactions } from "./transactions";

export function validateMockData() {
  const assetIds = new Set(mockAssets.map((asset) => asset.id));
  const clientIds = new Set(mockClients.map((client) => client.id));
  const portfolioIds = new Set(
    mockPortfolios.map((portfolio) => portfolio.id)
  );

  const errors: string[] = [];

  mockPortfolios.forEach((portfolio) => {
    if (!clientIds.has(portfolio.clientId)) {
      errors.push(`Invalid client: ${portfolio.clientId}`);
    }
  });

  mockHoldings.forEach((holding) => {
    if (!portfolioIds.has(holding.portfolioId)) {
      errors.push(`Invalid portfolio: ${holding.portfolioId}`);
    }

    if (!assetIds.has(holding.assetId)) {
      errors.push(`Invalid asset: ${holding.assetId}`);
    }

    if (!(holding.assetId in mockAssetPrices)) {
      errors.push(`Missing price: ${holding.assetId}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return {
    clients: mockClients.length,
    portfolios: mockPortfolios.length,
    assets: mockAssets.length,
    holdings: mockHoldings.length,
    valid: true,
  };
}

export function validateTransactions() {
  const portfolioIds = new Set(
    mockPortfolios.map((portfolio) => portfolio.id)
  );

  const assetIds = new Set(mockAssets.map((asset) => asset.id));

  const errors: string[] = [];

  mockTransactions.forEach((transaction) => {
    if (!portfolioIds.has(transaction.portfolioId)) {
      errors.push(`Invalid portfolio: ${transaction.id}`);
    }

    if (transaction.assetId && !assetIds.has(transaction.assetId)) {
      errors.push(`Invalid asset: ${transaction.id}`);
    }

    if (transaction.amount < 0 || transaction.charges < 0) {
      errors.push(`Invalid amount: ${transaction.id}`);
    }

    if (
      ["BUY", "SELL"].includes(transaction.type) &&
      (!transaction.assetId || !transaction.quantity || !transaction.price)
    ) {
      errors.push(`Missing trade details: ${transaction.id}`);
    }
  });

  if (errors.length) {
    throw new Error(errors.join("\n"));
  }

  return {
    total: mockTransactions.length,
    byType: Object.groupBy(mockTransactions, (transaction) => transaction.type),
    valid: true,
  };
}
