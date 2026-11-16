import type {
  ID,
  AssetClass,
  Currency,
  EntityStatus,
} from "@/types/common";

export type AssetType =
  | "STOCK"
  | "MUTUAL_FUND"
  | "ETF"
  | "BOND"
  | "GOLD";

export interface Asset {
  id: ID;
  name: string;
  symbol: string;
  isin?: string;

  assetType: AssetType;
  assetClass: AssetClass;

  exchange?: "NSE" | "BSE";
  sector?: string;
  fundHouse?: string;

  currency: Currency;
}

export interface Portfolio {
  id: ID;
  portfolioCode: string;

  clientId: ID;
  name: string;

  benchmarkId: ID;
  status: EntityStatus;

  createdAt: string;
  updatedAt: string;
}

export interface Holding {
  id: ID;
  portfolioId: ID;
  assetId: ID;

  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;

  lastUpdated: string;
}
