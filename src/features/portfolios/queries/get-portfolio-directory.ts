import { listPortfolioSnapshots } from "@/features/portfolios/queries/list-portfolios";
import type { EntityStatus } from "@/types/common";

export type PortfolioDirectoryRow = {
  id: string;
  portfolioCode: string;
  name: string;
  status: EntityStatus;
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  currentValue: number;
  returnPercentage: number;
  holdingsCount: number;
  stockCount: number;
  fundCount: number;
};

export function getPortfolioDirectory(): PortfolioDirectoryRow[] {
  return listPortfolioSnapshots()
    .flatMap((snapshot) => {
      if (!snapshot.client) return [];

      return [
        {
          id: snapshot.portfolio.id,
          portfolioCode: snapshot.portfolio.portfolioCode,
          name: snapshot.portfolio.name,
          status: snapshot.portfolio.status,
          clientId: snapshot.client.id,
          clientFirstName: snapshot.client.firstName,
          clientLastName: snapshot.client.lastName,
          currentValue: snapshot.metrics.currentValue,
          returnPercentage: snapshot.metrics.returnPercentage,
          holdingsCount: snapshot.metrics.holdingsCount,
          stockCount: snapshot.stockCount,
          fundCount: snapshot.fundCount,
        },
      ];
    })
    .sort((left, right) => right.currentValue - left.currentValue);
}
