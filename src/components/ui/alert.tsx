import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva(
  "grid w-full grid-cols-[1rem_1fr] items-start gap-x-2.5 gap-y-0.5 rounded-lg border px-3 py-2.5 text-sm [&>svg]:row-span-2 [&>svg]:mt-0.5 [&>svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-information/20 bg-information/10 text-foreground [&>svg]:text-information",
        success:
          "border-success/20 bg-success/10 text-foreground [&>svg]:text-success",
        destructive:
          "border-destructive/20 bg-destructive/10 text-foreground [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-title"
      className={cn("font-medium leading-5", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-description"
      className={cn("text-muted-foreground leading-5", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
