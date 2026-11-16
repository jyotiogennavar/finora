import type { AssetType } from "@/features/portfolios/types"
import type { AssetClass, EntityStatus, RiskProfile } from "@/types/common"
import type { TransactionStatus, TransactionType } from "@/features/transactions/types"

export const assetClassLabels: Record<AssetClass, string> = {
  EQUITY: "Equity",
  DEBT: "Debt",
  GOLD: "Gold",
  HYBRID: "Hybrid",
  CASH: "Cash",
}

export const assetClassColors: Record<AssetClass, string> = {
  EQUITY: "var(--foreground)",
  DEBT: "var(--information)",
  GOLD: "var(--pending)",
  HYBRID: "var(--active)",
  CASH: "var(--neutral)",
}

export const riskProfileLabels: Record<RiskProfile, string> = {
  CONSERVATIVE: "Conservative",
  MODERATE: "Moderate",
  AGGRESSIVE: "Aggressive",
}

export const assetTypeLabels: Record<AssetType, string> = {
  STOCK: "Stock",
  MUTUAL_FUND: "Mutual fund",
  ETF: "ETF",
  BOND: "Bond",
  GOLD: "Gold",
}

export const entityStatusLabels: Record<EntityStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
}

export const transactionTypeLabels: Record<TransactionType, string> = {
  BUY: "Buy",
  SELL: "Sell",
  DIVIDEND: "Dividend",
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  INTEREST: "Interest",
}

export const transactionStatusLabels: Record<TransactionStatus, string> = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  FAILED: "Failed",
}

export function fullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`
}

export function initials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
