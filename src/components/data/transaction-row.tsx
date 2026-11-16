import { MoneyText } from "@/components/finance/money-text"
import {
  TransactionStatusBadge,
  TransactionTypeBadge,
} from "@/components/finance/status-badge"
import { formatDisplayDate } from "@/lib/format/date"
import type { Transaction } from "@/features/transactions/types"

const outflowTypes = new Set(["BUY", "WITHDRAWAL"])

export function TransactionRow({
  transaction,
  subtitle,
  showStatus = true,
}: {
  transaction: Transaction
  subtitle?: string
  showStatus?: boolean
}) {
  const outflow = outflowTypes.has(transaction.type)
  const amount = outflow ? -transaction.amount : transaction.amount

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <TransactionTypeBadge value={transaction.type} />
          {showStatus ? (
            <TransactionStatusBadge value={transaction.status} />
          ) : null}
        </div>
        <p
          className="truncate text-sm"
          title={
            subtitle ?? transaction.description ?? transaction.transactionCode
          }
        >
          {subtitle ?? transaction.description ?? transaction.transactionCode}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDisplayDate(transaction.transactionDate)}
        </p>
      </div>
      <MoneyText
        amount={amount}
        signed
        fractionDigits={0}
        className="shrink-0 text-sm font-medium"
      />
    </div>
  )
}
