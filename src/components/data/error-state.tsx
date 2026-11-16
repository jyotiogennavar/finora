import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ErrorState({
  title = "Couldn’t load this data",
  description = "Try again. If it keeps happening, check the connection and reload the page.",
  onRetry,
  className,
}: {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col items-start justify-center gap-2 px-1 py-8",
        className
      )}
    >
      <p className="text-sm font-medium text-balance">{title}</p>
      <p className="max-w-prose text-sm leading-6 text-pretty text-muted-foreground">
        {description}
      </p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
