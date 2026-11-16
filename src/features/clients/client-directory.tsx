"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { DataTable, type DataTableColumn } from "@/components/data/data-table"
import { ClientAvatar } from "@/components/finance/client-avatar"
import { MoneyText } from "@/components/finance/money-text"
import { ReturnIndicator } from "@/components/finance/return-indicator"
import {
  EntityStatusBadge,
  RiskBadge,
} from "@/components/finance/status-badge"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  parseAddedClients,
  readAddedClients,
  saveAddedClient,
  useAddedClientsRaw,
  useHydrated,
} from "@/features/clients/added-clients"
import {
  AddClientDialog,
  type NewClientInput,
} from "@/features/clients/add-client-dialog"
import {
  directoryRowFromClient,
  type ClientDirectoryRow,
} from "@/features/clients/queries/get-client-directory"
import type { Client } from "@/features/clients/types"
import {
  entityStatusLabels,
  fullName,
  riskProfileLabels,
} from "@/lib/format/labels"
import type { EntityStatus, RiskProfile } from "@/types/common"

const columns: DataTableColumn<ClientDirectoryRow>[] = [
  {
    id: "client",
    header: "Client",
    sortable: true,
    sortValue: (row) => fullName(row.firstName, row.lastName),
    cell: (row) => (
      <div className="flex items-center gap-3">
        <ClientAvatar
          firstName={row.firstName}
          lastName={row.lastName}
          size="sm"
          labelled={false}
        />
        <div className="min-w-0">
          <Link
            href={`/clients/${row.id}`}
            className="font-medium hover:underline underline-offset-4"
          >
            {fullName(row.firstName, row.lastName)}
          </Link>
          <p className="text-xs text-muted-foreground">{row.clientCode}</p>
        </div>
      </div>
    ),
  },
  {
    id: "risk",
    header: "Risk",
    sortable: true,
    sortValue: (row) => row.riskProfile,
    cell: (row) => <RiskBadge value={row.riskProfile} />,
  },
  {
    id: "status",
    header: "Status",
    sortable: true,
    sortValue: (row) => row.status,
    cell: (row) => <EntityStatusBadge value={row.status} />,
  },
  {
    id: "portfolios",
    header: "Portfolios",
    align: "right",
    sortable: true,
    sortValue: (row) => row.portfolioCount,
    cell: (row) => (
      <span className="tabular-nums">{row.portfolioCount}</span>
    ),
  },
  {
    id: "aum",
    header: "AUM",
    align: "right",
    sortable: true,
    sortValue: (row) => row.totalAum,
    cell: (row) => <MoneyText amount={row.totalAum} />,
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

export function ClientDirectory({ rows: serverRows }: { rows: ClientDirectoryRow[] }) {
  const hydrated = useHydrated()
  const addedRaw = useAddedClientsRaw()
  const [risk, setRisk] = useState<"all" | RiskProfile>("all")
  const [status, setStatus] = useState<"all" | EntityStatus>("all")

  const rows = useMemo(() => {
    if (!hydrated) return serverRows
    const extras = parseAddedClients(addedRaw)
      .filter((client) => !serverRows.some((row) => row.id === client.id))
      .map(directoryRowFromClient)
      .reverse()
    return extras.length ? [...extras, ...serverRows] : serverRows
  }, [addedRaw, hydrated, serverRows])

  function emailTaken(email: string) {
    const needle = email.trim().toLowerCase()
    if (serverRows.some((row) => row.email.toLowerCase() === needle)) return true
    return readAddedClients().some(
      (client) => client.email.toLowerCase() === needle
    )
  }

  function handleCreate(input: NewClientInput) {
    const serial = serverRows.length + readAddedClients().length + 1
    const now = new Date().toISOString()
    const client: Client = {
      id: `CLI${String(serial).padStart(3, "0")}`,
      clientCode: `FIN-${1000 + serial}`,
      ...input,
      assignedManagerId: "MGR001",
      createdAt: now,
      updatedAt: now,
    }
    saveAddedClient(client)
    toast.success(`${fullName(client.firstName, client.lastName)} is on the book.`)
  }

  const visible = rows.filter((row) => {
    if (risk !== "all" && row.riskProfile !== risk) return false
    if (status !== "all" && row.status !== status) return false
    return true
  })

  const filtersActive = risk !== "all" || status !== "all"

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Clients"
        description="People and households you advise."
        actions={
          <AddClientDialog onCreate={handleCreate} emailTaken={emailTaken} />
        }
      />
      <DataTable
        rows={visible}
        columns={columns}
        rowKey={(row) => row.id}
        pageSize={8}
        search={(row, query) => {
          const name = fullName(row.firstName, row.lastName).toLowerCase()
          return (
            name.includes(query) ||
            row.email.toLowerCase().includes(query) ||
            row.clientCode.toLowerCase().includes(query) ||
            row.occupation.toLowerCase().includes(query)
          )
        }}
        searchLabel="Search"
        searchPlaceholder="Name, email, or code"
        emptyTitle="No clients match"
        emptyDescription="Try another name, email, or code, or clear the filters."
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <FilterSelect
              id="client-risk"
              label="Risk profile"
              value={risk}
              onChange={(value) => setRisk(value as "all" | RiskProfile)}
              options={[
                ["all", "All profiles"],
                ...Object.entries(riskProfileLabels),
              ]}
            />
            <FilterSelect
              id="client-status"
              label="Status"
              value={status}
              onChange={(value) => setStatus(value as "all" | EntityStatus)}
              options={[
                ["all", "All statuses"],
                ...Object.entries(entityStatusLabels),
              ]}
            />
            {filtersActive ? (
              <Button
                variant="outline"
                onClick={() => {
                  setRisk("all")
                  setStatus("all")
                }}
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        }
      />
    </div>
  )
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: [string, string][]
}) {
  return (
    <div className="w-full space-y-2 sm:w-44">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next) onChange(String(next))
        }}
      >
        <SelectTrigger id={id} className="w-full text-base md:text-sm">
          <span className="line-clamp-1 flex flex-1 text-left">
            {options.find(([optionValue]) => optionValue === value)?.[1]}
          </span>
        </SelectTrigger>
        <SelectContent>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
