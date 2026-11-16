"use client"

import { useState } from "react"

import { DataTable, type DataTableColumn } from "@/components/data/data-table"
import { MoneyText } from "@/components/finance/money-text"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import type { HoldingBreakdown } from "@/features/portfolios/queries/get-portfolio-summary"
import { assetTypeLabels } from "@/lib/format/labels"

const quantityFormat = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 3,
})

type InstrumentFilter = "all" | "STOCK" | "MUTUAL_FUND"

const columns: DataTableColumn<HoldingBreakdown>[] = [
  {
    id: "holding",
    header: "Holding",
    sortable: true,
    sortValue: (row) => row.name,
    cell: (row) => (
      <div className="min-w-0">
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.symbol}</p>
      </div>
    ),
  },
  {
    id: "type",
    header: "Type",
    sortable: true,
    sortValue: (row) => assetTypeLabels[row.assetType],
    cell: (row) => assetTypeLabels[row.assetType],
  },
  {
    id: "quantity",
    header: "Quantity",
    align: "right",
    sortable: true,
    sortValue: (row) => row.quantity,
    cell: (row) => (
      <span className="tabular-nums">{quantityFormat.format(row.quantity)}</span>
    ),
  },
  {
    id: "value",
    header: "Value",
    align: "right",
    sortable: true,
    sortValue: (row) => row.value,
    cell: (row) => <MoneyText amount={row.value} />,
  },
  {
    id: "return",
    header: "Return",
    align: "right",
    sortable: true,
    sortValue: (row) => row.returnPercentage,
    cell: (row) => (
      <div className="flex justify-end">
        <ReturnIndicator value={row.returnPercentage} />
      </div>
    ),
  },
]

const emptyCopy: Record<InstrumentFilter, { title: string; description: string }> =
  {
    all: {
      title: "No holdings",
      description: "Positions will show here once this portfolio holds them.",
    },
    STOCK: {
      title: "No stocks",
      description: "This portfolio has no stock positions.",
    },
    MUTUAL_FUND: {
      title: "No mutual funds",
      description: "This portfolio has no mutual fund positions.",
    },
  }

export function HoldingsTable({ rows }: { rows: HoldingBreakdown[] }) {
  const [instrument, setInstrument] = useState<InstrumentFilter>("all")
  const visible =
    instrument === "all"
      ? rows
      : rows.filter((row) => row.assetType === instrument)
  const empty = emptyCopy[instrument]

  return (
    <DataTable
      rows={visible}
      columns={columns}
      rowKey={(row) => row.id}
      pageSize={8}
      search={(row, query) =>
        row.name.toLowerCase().includes(query) ||
        row.symbol.toLowerCase().includes(query)
      }
      searchLabel="Search"
      searchPlaceholder="Name or symbol"
      emptyTitle={empty.title}
      emptyDescription={empty.description}
      toolbar={
        <div className="w-full space-y-2 sm:w-44">
          <Label htmlFor="holding-instrument">Instrument</Label>
          <Select
            value={instrument}
            onValueChange={(value) => {
              if (value) setInstrument(value as InstrumentFilter)
            }}
          >
            <SelectTrigger
              id="holding-instrument"
              className="w-full text-base md:text-sm"
            >
              <span className="line-clamp-1 flex flex-1 text-left">
                {instrument === "STOCK"
                  ? "Stocks"
                  : instrument === "MUTUAL_FUND"
                    ? "Mutual funds"
                    : "All instruments"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All instruments</SelectItem>
              <SelectItem value="STOCK">Stocks</SelectItem>
              <SelectItem value="MUTUAL_FUND">Mutual funds</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    />
  )
}
