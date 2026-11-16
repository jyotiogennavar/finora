import type { AllocationItem } from "@/features/analytics/types";
import type { Client } from "@/features/clients/types";
import { calculateAllocation } from "@/lib/calculations/allocation";
import { calculateReturnPercentage } from "@/lib/calculations/returns";
import { mockAssets, mockClients, mockHoldings } from "@/mocks";
import { listPortfolioSnapshots } from "@/features/portfolios/queries/list-portfolios";
import type { EntityStatus } from "@/types/common";

export type ClientPortfolioSummary = {
  id: string;
  name: string;
  status: EntityStatus;
  currentValue: number;
  returnPercentage: number;
  absoluteReturn: number;
  holdingsCount: number;
};

export type ClientProfile = {
  client: Client;
  portfolios: ClientPortfolioSummary[];
  totalAum: number;
  returnPercentage: number;
  allocation: AllocationItem[];
};

export function profileFromAddedClient(client: Client): ClientProfile {
  return {
    client,
    portfolios: [],
    totalAum: 0,
    returnPercentage: 0,
    allocation: [],
  };
}

export function getClientProfile(id: string): ClientProfile | null {
  const client = mockClients.find((item) => item.id === id);
  if (!client) return null;

  const books = listPortfolioSnapshots().filter(
    (snapshot) => snapshot.portfolio.clientId === client.id
  );
  const portfolioIds = new Set(books.map((book) => book.portfolio.id));
  const holdings = mockHoldings.filter((holding) =>
    portfolioIds.has(holding.portfolioId)
  );
  const cash = books.reduce(
    (total, book) => total + book.metrics.cashBalance,
    0
  );
  const totalAum = books.reduce(
    (total, book) => total + book.metrics.currentValue,
    0
  );
  const contributions = books.reduce(
    (total, book) => total + book.metrics.netContributions,
    0
  );

  return {
    client,
    totalAum,
    returnPercentage: calculateReturnPercentage(totalAum, contributions),
    allocation: calculateAllocation(holdings, mockAssets, cash),
    portfolios: books
      .map((book) => ({
        id: book.portfolio.id,
        name: book.portfolio.name,
        status: book.portfolio.status,
        currentValue: book.metrics.currentValue,
        returnPercentage: book.metrics.returnPercentage,
        absoluteReturn: book.metrics.absoluteReturn,
        holdingsCount: book.metrics.holdingsCount,
      }))
      .sort((left, right) => right.currentValue - left.currentValue),
  };
}
