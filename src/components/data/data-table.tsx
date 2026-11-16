"use client"

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react"
import { IconArrowsSort, IconChevronDown, IconChevronUp } from "@tabler/icons-react"

import { EmptyState } from "@/components/data/empty-state"
import { Pagination } from "@/components/data/pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type DataTableColumn<T> = {
  id: string
  header: string
  align?: "left" | "right"
  sortable?: boolean
  sortValue?: (row: T) => string | number
  cell: (row: T) => ReactNode
}

type SortState = {
  id: string
  direction: "asc" | "desc"
} | null

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  search,
  searchPlaceholder = "Filter rows",
  searchLabel = "Filter",
  pageSize = 5,
  emptyTitle = "Nothing to show",
  emptyDescription,
  toolbar,
  className,
}: {
  rows: T[]
  columns: DataTableColumn<T>[]
  rowKey: (row: T) => string
  search?: (row: T, query: string) => boolean
  searchPlaceholder?: string
  searchLabel?: string
  pageSize?: number
  emptyTitle?: string
  emptyDescription?: string
  toolbar?: ReactNode
  className?: string
}) {
  const filterId = useId()
  const [query, setQuery] = useState("")
  const [deferredQuery, setDeferredQuery] = useState("")
  const [sort, setSort] = useState<SortState>(null)
  const [page, setPage] = useState(1)
  const debounceRef = useRef<number>(0)

  useEffect(() => {
    return () => window.clearTimeout(debounceRef.current)
  }, [])

  function setSearchQuery(value: string) {
    setQuery(value)
    setPage(1)
    window.clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setDeferredQuery("")
      return
    }
    debounceRef.current = window.setTimeout(() => {
      setDeferredQuery(value)
    }, 300)
  }

  const filtered = useMemo(() => {
    if (!search || !deferredQuery.trim()) return rows
    const needle = deferredQuery.trim().toLowerCase()
    return rows.filter((row) => search(row, needle))
  }, [deferredQuery, rows, search])

  const sorted = useMemo(() => {
    if (!sort) return filtered
    const column = columns.find((item) => item.id === sort.id)
    if (!column?.sortValue) return filtered

    const next = [...filtered]
    next.sort((a, b) => {
      const left = column.sortValue!(a)
      const right = column.sortValue!(b)
      if (left < right) return sort.direction === "asc" ? -1 : 1
      if (left > right) return sort.direction === "asc" ? 1 : -1
      return 0
    })
    return next
  }, [columns, filtered, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const paged = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  function toggleSort(column: DataTableColumn<T>) {
    if (!column.sortable || !column.sortValue) return
    setPage(1)
    setSort((current) => {
      if (current?.id !== column.id) return { id: column.id, direction: "desc" }
      if (current.direction === "desc") return { id: column.id, direction: "asc" }
      return null
    })
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        {search ? (
          <div className="w-full space-y-2 sm:max-w-xs">
            <Label htmlFor={filterId}>{searchLabel}</Label>
            <Input
              id={filterId}
              value={query}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={searchPlaceholder}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        ) : null}
        {toolbar}
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                const ariaSort =
                  sort?.id === column.id
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : column.sortable
                      ? "none"
                      : undefined

                return (
                  <TableHead
                    key={column.id}
                    aria-sort={ariaSort}
                    className={cn(column.align === "right" && "text-right")}
                  >
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "-ml-2 min-h-10 px-2 font-medium",
                          column.align === "right" && "ml-auto"
                        )}
                        onClick={() => toggleSort(column)}
                      >
                        {column.header}
                        <SortIcon
                          direction={
                            sort?.id === column.id ? sort.direction : undefined
                          }
                        />
                      </Button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    className="min-h-52 py-6"
                    action={
                      query ? (
                        <Button
                          variant="outline"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear search
                        </Button>
                      ) : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        column.align === "right" && "text-right"
                      )}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {sorted.length > pageSize ? (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  )
}

function SortIcon({ direction }: { direction?: "asc" | "desc" }) {
  if (direction === "asc") return <IconChevronUp aria-hidden />
  if (direction === "desc") return <IconChevronDown aria-hidden />
  return <IconArrowsSort className="opacity-50" aria-hidden />
}
