import type { ID, Currency } from "@/types/common";

export type TransactionType =
  | "BUY"
  | "SELL"
  | "DIVIDEND"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "INTEREST";

export type TransactionStatus =
  | "COMPLETED"
  | "PENDING"
  | "FAILED";

export interface Transaction {
  id: ID;
  transactionCode: string;

  portfolioId: ID;
  assetId?: ID;

  type: TransactionType;
  status: TransactionStatus;

  quantity?: number;
  price?: number;

  amount: number;
  charges: number;

  currency: Currency;
  transactionDate: string;

  description?: string;
  createdAt: string;
}
