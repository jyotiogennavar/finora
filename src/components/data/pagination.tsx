import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
}: {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  className?: string
}) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-end gap-2", className)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="relative before:absolute before:-inset-1 before:content-['']"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <IconChevronLeft aria-hidden />
      </Button>
      {pages.map((item) => (
        <Button
          key={item}
          variant={item === page ? "secondary" : "ghost"}
          size="icon"
          className="relative tabular-nums before:absolute before:-inset-1 before:content-['']"
          aria-label={`Page ${item}`}
          aria-current={item === page ? "page" : undefined}
          onClick={() => onPageChange(item)}
        >
          {item}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="relative before:absolute before:-inset-1 before:content-['']"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <IconChevronRight aria-hidden />
      </Button>
    </nav>
  )
}
