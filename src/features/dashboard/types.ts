import type {
  AllocationItem,
  PerformancePoint,
} from "@/features/analytics/types";

import type { Transaction } from "@/features/transactions/types";
import type { EntityStatus, RiskProfile } from "@/types/common";

export interface DashboardSummary {
  totalAum: number;
  netContributions: number;
  totalProfitLoss: number;
  totalReturnPercentage: number;

  clientCount: number;
  activeClientCount: number;

  portfolioCount: number;
  activePortfolioCount: number;

  holdingsCount: number;
}

export interface DashboardClientRow {
  clientId: string;
  clientName: string;
  portfolioCount: number;
  totalAum: number;
  riskProfile: string;
}

export interface DashboardPortfolioRow {
  portfolioId: string;
  portfolioName: string;
  clientName: string;
  currentValue: number;
  returnPercentage: number;
}

export type AttentionKind =
  | "equity-high"
  | "equity-low"
  | "negative-return"
  | "inactive";

export interface DashboardAttentionClient {
  clientId: string;
  firstName: string;
  lastName: string;
  riskProfile: RiskProfile;
  status: EntityStatus;
  totalAum: number;
  equityPercentage: number;
  returnPercentage: number;
  kind: AttentionKind;
}

export interface DashboardFlows {
  inflows: number;
  outflows: number;
  inflowCount: number;
  outflowCount: number;
}

export interface DashboardActivity {
  transaction: Transaction;
  clientName: string;
  portfolioName: string;
}

export interface DashboardOverview {
  summary: DashboardSummary;
  flows: DashboardFlows;
  allocation: AllocationItem[];
  performanceHistory: PerformancePoint[];
  topClients: DashboardClientRow[];
  topPortfolios: DashboardPortfolioRow[];
  attention: DashboardAttentionClient[];
  recentActivity: DashboardActivity[];
}
