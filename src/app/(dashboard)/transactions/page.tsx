import type { Metadata } from "next"

import { TransactionLedger } from "@/features/transactions/transaction-ledger"
import { getTransactionLedger } from "@/features/transactions/queries/get-transaction-ledger"

export const metadata: Metadata = {
  title: "Transactions",
}

export default function TransactionsPage() {
  return <TransactionLedger rows={getTransactionLedger()} />
}
