import { MoneyText } from "@/components/finance/money-text"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import { cn } from "@/lib/utils"

export type ClientPortfolioItem = {
  id: string
  name: string
  currentValue: number
  returnPercentage: number
}

export function ClientPortfolioList({
  items,
  className,
}: {
  items: ClientPortfolioItem[]
  className?: string
}) {
  return (
    <ul className={cn("divide-y", className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium" title={item.name}>
              {item.name}
            </p>
            <MoneyText
              amount={item.currentValue}
              className="text-xs text-muted-foreground"
            />
          </div>
          <ReturnIndicator
            value={item.returnPercentage}
            size="md"
            className="shrink-0"
          />
        </li>
      ))}
    </ul>
  )
}
