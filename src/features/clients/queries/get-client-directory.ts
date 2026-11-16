import { calculateReturnPercentage } from "@/lib/calculations/returns";
import { mockClients } from "@/mocks";
import { listPortfolioSnapshots } from "@/features/portfolios/queries/list-portfolios";

import type { Client } from "@/features/clients/types";
import type { EntityStatus, RiskProfile } from "@/types/common";

export type ClientDirectoryRow = {
  id: string;
  clientCode: string;
  firstName: string;
  lastName: string;
  email: string;
  occupation: string;
  riskProfile: RiskProfile;
  status: EntityStatus;
  portfolioCount: number;
  totalAum: number;
  returnPercentage: number;
};

export function directoryRowFromClient(client: Client): ClientDirectoryRow {
  return {
    id: client.id,
    clientCode: client.clientCode,
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email,
    occupation: client.occupation,
    riskProfile: client.riskProfile,
    status: client.status,
    portfolioCount: 0,
    totalAum: 0,
    returnPercentage: 0,
  };
}

export function getClientDirectory(): ClientDirectoryRow[] {
  const snapshots = listPortfolioSnapshots();

  return mockClients
    .map((client) => {
      const books = snapshots.filter(
        (snapshot) => snapshot.portfolio.clientId === client.id
      );
      const totalAum = books.reduce(
        (total, snapshot) => total + snapshot.metrics.currentValue,
        0
      );
      const contributions = books.reduce(
        (total, snapshot) => total + snapshot.metrics.netContributions,
        0
      );

      return {
        ...directoryRowFromClient(client),
        portfolioCount: books.length,
        totalAum,
        returnPercentage: calculateReturnPercentage(totalAum, contributions),
      };
    })
    .sort((left, right) => right.totalAum - left.totalAum);
}
