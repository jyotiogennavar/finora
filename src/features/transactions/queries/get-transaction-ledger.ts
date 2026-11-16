import type { Asset } from "@/features/portfolios/types"
import type {
  TransactionStatus,
  TransactionType,
} from "@/features/transactions/types"
import { fullName } from "@/lib/format/labels"
import {
  mockAssets,
  mockClients,
  mockPortfolios,
  mockTransactions,
} from "@/mocks"

export type LedgerKind =
  | "PURCHASE"
  | "REDEMPTION"
  | "SIP"
  | "DIVIDEND"
  | "INTEREST"
  | "DEPOSIT"
  | "WITHDRAWAL"

export type LedgerRow = {
  id: string
  code: string
  date: string
  kind: LedgerKind
  type: TransactionType
  status: TransactionStatus
  amount: number
  description: string
  quantity?: number
  portfolioId: string
  portfolioName: string
  clientId: string
  clientName: string
  assetName?: string
  assetSymbol?: string
}

const portfolios = new Map(
  mockPortfolios.map((portfolio) => [portfolio.id, portfolio])
)
const clients = new Map(mockClients.map((client) => [client.id, client]))
const assets = new Map(mockAssets.map((asset) => [asset.id, asset]))

function ledgerKind(
  type: TransactionType,
  asset: Asset | undefined
): LedgerKind {
  if (type === "BUY" && asset?.assetType === "MUTUAL_FUND") return "SIP"
  if (type === "BUY") return "PURCHASE"
  if (type === "SELL") return "REDEMPTION"
  if (type === "DIVIDEND") return "DIVIDEND"
  if (type === "INTEREST") return "INTEREST"
  if (type === "DEPOSIT") return "DEPOSIT"
  return "WITHDRAWAL"
}

export function getTransactionLedger(): LedgerRow[] {
  const rows: LedgerRow[] = []

  for (const transaction of mockTransactions) {
    const portfolio = portfolios.get(transaction.portfolioId)
    if (!portfolio) continue
    const client = clients.get(portfolio.clientId)
    if (!client) continue
    const asset = transaction.assetId
      ? assets.get(transaction.assetId)
      : undefined

    rows.push({
      id: transaction.id,
      code: transaction.transactionCode,
      date: transaction.transactionDate.slice(0, 10),
      kind: ledgerKind(transaction.type, asset),
      type: transaction.type,
      status: transaction.status,
      amount: transaction.amount,
      description: transaction.description ?? transaction.transactionCode,
      quantity: transaction.quantity,
      portfolioId: portfolio.id,
      portfolioName: portfolio.name,
      clientId: client.id,
      clientName: fullName(client.firstName, client.lastName),
      assetName: asset?.name,
      assetSymbol: asset?.symbol,
    })
  }

  rows.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
  return rows
}
