export type ID = string;

export type Currency = "INR";

export type AssetClass =
  | "EQUITY"
  | "DEBT"
  | "GOLD"
  | "HYBRID"
  | "CASH";

export type RiskProfile =
  | "CONSERVATIVE"
  | "MODERATE"
  | "AGGRESSIVE";

export type EntityStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface DateRange {
  from: string;
  to: string;
}

export interface MonetaryValue {
  amount: number;
  currency: Currency;
}
