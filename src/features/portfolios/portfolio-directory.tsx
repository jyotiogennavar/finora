"use client"

import { useState } from "react"
import Link from "next/link"

import { DataTable, type DataTableColumn } from "@/components/data/data-table"
import { MoneyText } from "@/components/finance/money-text"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import { EntityStatusBadge } from "@/components/finance/status-badge"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import type { PortfolioDirectoryRow } from "@/features/portfolios/queries/get-portfolio-directory"
import { entityStatusLabels, fullName } from "@/lib/format/labels"
import type { EntityStatus } from "@/types/common"

const columns: DataTableColumn<PortfolioDirectoryRow>[] = [
  {
    id: "portfolio",
    header: "Portfolio",
    sortable: true,
    sortValue: (row) => row.name,
    cell: (row) => (
      <div className="min-w-0">
        <Link
          href={`/portfolios/${row.id}`}
          className="font-medium hover:underline underline-offset-4"
        >
          {row.name}
        </Link>
        <p className="text-xs text-muted-foreground">{row.portfolioCode}</p>
      </div>
    ),
  },
  {
    id: "client",
    header: "Client",
    sortable: true,
    sortValue: (row) => fullName(row.clientFirstName, row.clientLastName),
    cell: (row) => (
      <Link
        href={`/clients/${row.clientId}`}
        className="hover:underline underline-offset-4"
      >
        {fullName(row.clientFirstName, row.clientLastName)}
      </Link>
    ),
  },
  {
    id: "holdings",
    header: "Holdings",
    align: "right",
    sortable: true,
    sortValue: (row) => row.holdingsCount,
    cell: (row) => {
      const mix = instrumentMix(row.stockCount, row.fundCount)
      return (
        <div>
          <span className="tabular-nums">{row.holdingsCount}</span>
          {mix ? (
            <p className="text-xs text-muted-foreground">{mix}</p>
          ) : null}
        </div>
      )
    },
  },
  {
    id: "value",
    header: "Value",
    align: "right",
    sortable: true,
    sortValue: (row) => row.currentValue,
    cell: (row) => <MoneyText amount={row.currentValue} />,
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
  {
    id: "status",
    header: "Status",
    sortable: true,
    sortValue: (row) => row.status,
    cell: (row) => <EntityStatusBadge value={row.status} />,
  },
]

export function PortfolioDirectory({
  rows,
}: {
  rows: PortfolioDirectoryRow[]
}) {
  const [status, setStatus] = useState<"all" | EntityStatus>("all")
  const visible =
    status === "all" ? rows : rows.filter((row) => row.status === status)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Portfolios"
        description="Accounts, holdings, and mandates."
      />
      <DataTable
        rows={visible}
        columns={columns}
        rowKey={(row) => row.id}
        pageSize={8}
        search={(row, query) => {
          const client = fullName(
            row.clientFirstName,
            row.clientLastName
          ).toLowerCase()
          return (
            row.name.toLowerCase().includes(query) ||
            row.portfolioCode.toLowerCase().includes(query) ||
            client.includes(query)
          )
        }}
        searchLabel="Search"
        searchPlaceholder="Portfolio, client, or code"
        emptyTitle="No portfolios match"
        emptyDescription="Try another name, client, or code, or clear the status filter."
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full space-y-2 sm:w-44">
              <Label htmlFor="portfolio-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  if (value) setStatus(value as "all" | EntityStatus)
                }}
              >
                <SelectTrigger
                  id="portfolio-status"
                  className="w-full text-base md:text-sm"
                >
                  <span className="line-clamp-1 flex flex-1 text-left">
                    {status === "all" ? "All statuses" : entityStatusLabels[status]}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {Object.entries(entityStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {status !== "all" ? (
              <Button variant="outline" onClick={() => setStatus("all")}>
                Clear filters
              </Button>
            ) : null}
          </div>
        }
      />
    </div>
  )
}

function instrumentMix(stocks: number, funds: number) {
  const parts: string[] = []
  if (stocks > 0) {
    parts.push(`${stocks} ${stocks === 1 ? "stock" : "stocks"}`)
  }
  if (funds > 0) {
    parts.push(`${funds} ${funds === 1 ? "mutual fund" : "mutual funds"}`)
  }
  return parts.join(" · ")
}
