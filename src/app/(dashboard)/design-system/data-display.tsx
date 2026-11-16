"use client"

import { useMemo, useState } from "react"

import { ClientPortfolioList } from "@/components/data/client-portfolio-list"
import { DataTable, type DataTableColumn } from "@/components/data/data-table"
import { EmptyState } from "@/components/data/empty-state"
import { ErrorState } from "@/components/data/error-state"
import { TableSkeleton } from "@/components/data/table-skeleton"
import { TransactionRow } from "@/components/data/transaction-row"
import { MoneyText } from "@/components/finance/money-text"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { assetClassLabels } from "@/lib/format/labels"
import type { AssetClass } from "@/types/common"

import {
  specimenClientPortfolios,
  specimenHoldings,
  specimenTransactions,
} from "./specimen-data"
import { Section, Specimen, Subheading } from "./specimen"

type HoldingRow = (typeof specimenHoldings)[number]

const holdingColumns: DataTableColumn<HoldingRow>[] = [
  {
    id: "name",
    header: "Holding",
    sortable: true,
    sortValue: (row) => row.name,
    cell: (row) => (
      <div className="min-w-0">
        <p className="truncate font-medium" title={row.name}>
          {row.name}
        </p>
        <p className="text-xs text-muted-foreground">{row.symbol}</p>
      </div>
    ),
  },
  {
    id: "class",
    header: "Class",
    sortable: true,
    sortValue: (row) => row.assetClass,
    cell: (row) => assetClassLabels[row.assetClass],
  },
  {
    id: "value",
    header: "Value",
    align: "right",
    sortable: true,
    sortValue: (row) => row.value,
    cell: (row) => <MoneyText amount={row.value} className="font-medium" />,
  },
  {
    id: "change",
    header: "Return",
    align: "right",
    sortable: true,
    sortValue: (row) => row.change,
    cell: (row) => <ReturnIndicator value={row.change} />,
  },
]

export function DataDisplaySection() {
  return (
    <Section
      id="data-display"
      title="04. Data display"
      description="Tables do the sorting and paging. Lists are for a handful of rows the user will scan, not query."
    >
      <div className="space-y-3">
        <Subheading>Holdings table</Subheading>
        <HoldingsTable />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen>
          <Subheading>Transaction rows</Subheading>
          <ul className="mt-3 divide-y">
            {specimenTransactions.map((transaction) => (
              <li key={transaction.id}>
                <TransactionRow transaction={transaction} />
              </li>
            ))}
          </ul>
        </Specimen>

        <Specimen>
          <Subheading>Client portfolio list</Subheading>
          <ClientPortfolioList items={specimenClientPortfolios} />
        </Specimen>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Specimen>
          <Subheading>Empty</Subheading>
          <EmptyState
            title="No holdings yet"
            description="Buy an asset or import a contract note to start this book."
            action={<Button>Record a buy</Button>}
          />
        </Specimen>
        <Specimen>
          <Subheading>Loading</Subheading>
          <TableSkeleton rows={4} columns={3} />
        </Specimen>
        <Specimen>
          <Subheading>Error</Subheading>
          <ErrorState
            title="Couldn’t load holdings"
            description="The latest prices didn’t come back. Try again in a moment."
            onRetry={() => undefined}
          />
        </Specimen>
      </div>
    </Section>
  )
}

function HoldingsTable() {
  const [assetClass, setAssetClass] = useState("all")

  const rows = useMemo(() => {
    if (assetClass === "all") return specimenHoldings
    return specimenHoldings.filter((row) => row.assetClass === assetClass)
  }, [assetClass])

  return (
    <DataTable
      rows={rows}
      columns={holdingColumns}
      rowKey={(row) => row.id}
      pageSize={4}
      search={(row, query) =>
        row.name.toLowerCase().includes(query) ||
        row.symbol.toLowerCase().includes(query)
      }
      searchPlaceholder="Search holdings"
      searchLabel="Search"
      emptyTitle="No holdings match"
      emptyDescription="Clear the search or pick a different asset class."
      toolbar={
        <div className="w-full space-y-2 sm:w-44">
          <p className="text-sm font-medium">Asset class</p>
          <Select
            value={assetClass}
            onValueChange={(value) => {
              if (value) setAssetClass(String(value))
            }}
          >
            <SelectTrigger className="w-full text-base md:text-sm">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {Object.entries(assetClassLabels).map(([value, label]) => (
                <SelectItem key={value} value={value as AssetClass}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    />
  )
}
