"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { IconDots, IconDownload } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ClientSummary } from "@/components/finance/client-summary"
import { MoneyText } from "@/components/finance/money-text"
import { AllocationSummary } from "@/components/finance/allocation-summary"
import { formatInr } from "@/lib/format/inr"

import {
  portfolio,
  specimenClient,
  specimenClientAum,
} from "./specimen-data"
import { Section, Specimen, Subheading } from "./specimen"

export function InteractionsSection() {
  return (
    <Section
      id="interactions"
      title="07. Interaction states"
      description="Confirm before money moves. Validate beside the field, on blur first, then as the user fixes it."
    >
      <Specimen className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            Record contribution
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record contribution</DialogTitle>
              <DialogDescription>
                Credit ₹50,000 to {portfolio.portfolio.name}. This posts as a
                completed deposit.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => toast.success("Contribution of ₹50,000 recorded")}
              >
                Record ₹50,000
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Open drawer
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{portfolio.portfolio.name}</SheetTitle>
              <SheetDescription>
                {specimenClient.firstName} {specimenClient.lastName}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 px-4 pb-4">
              <ClientSummary
                firstName={specimenClient.firstName}
                lastName={specimenClient.lastName}
                email={specimenClient.email}
                occupation={specimenClient.occupation}
                riskProfile={specimenClient.riskProfile}
                status={specimenClient.status}
                aum={specimenClientAum}
              />
              <div>
                <p className="mb-2 text-sm font-medium">Allocation</p>
                <AllocationSummary items={portfolio.allocation} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            NAV tooltip
          </TooltipTrigger>
          <TooltipContent>Net asset value as of 31 Oct 2026</TooltipContent>
        </Tooltip>

        <Button
          variant="outline"
          onClick={() => toast.success("Portfolio saved")}
        >
          Success toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error("Mandate expired", {
              description: "Renew the SIP before the next debit date.",
            })
          }
        >
          Error toast
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" aria-label="Portfolio actions" />
            }
          >
            <IconDots />
            Actions
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => toast.success("CSV export started")}
            >
              <IconDownload />
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.success("Copied portfolio link")}
            >
              Copy link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              Archive portfolio
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            Cancel SIP
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel the SIP mandate?</AlertDialogTitle>
              <AlertDialogDescription>
                Future debits stop after today. Settled installments stay in
                the book.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep mandate</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => toast.success("SIP mandate cancelled")}
              >
                Cancel mandate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Specimen>

      <div className="space-y-3">
        <Subheading>Form validation</Subheading>
        <Specimen>
          <ContributionForm />
        </Specimen>
      </div>
    </Section>
  )
}

function ContributionForm() {
  const [amount, setAmount] = useState("50000")
  const [email, setEmail] = useState(specimenClient.email)
  const [confirmed, setConfirmed] = useState(false)
  const [errors, setErrors] = useState<{
    amount?: string
    email?: string
    confirmed?: string
  }>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  function validate(next = { amount, email, confirmed }) {
    const result: typeof errors = {}
    const parsed = Number(next.amount.replace(/,/g, ""))
    if (!next.amount.trim()) result.amount = "Enter an amount."
    else if (!Number.isFinite(parsed) || parsed <= 0) {
      result.amount = "Amount must be greater than ₹0."
    }
    if (!next.email.trim()) result.email = "Enter an email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) {
      result.email = "Enter an email with an @ and a domain."
    }
    if (!next.confirmed) {
      result.confirmed = "Confirm the amount before recording."
    }
    return result
  }

  function reveal(field: string) {
    setRevealed((current) => ({ ...current, [field]: true }))
    setErrors(validate())
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validate()
    setRevealed({ amount: true, email: true, confirmed: true })
    setErrors(next)
    if (Object.keys(next).length > 0) return
    toast.success("Contribution scheduled", {
      description: `${formatInr(Number(amount), 0)} to ${portfolio.portfolio.name}.`,
    })
  }

  const parsedAmount = Number(amount.replace(/,/g, ""))

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contribution-amount">Amount</Label>
        <Input
          id="contribution-amount"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={amount}
          aria-invalid={revealed.amount && !!errors.amount}
          aria-describedby="contribution-amount-error"
          onBlur={() => reveal("amount")}
          onChange={(event) => {
            setAmount(event.target.value)
            if (revealed.amount) {
              setErrors(validate({ amount: event.target.value, email, confirmed }))
            }
          }}
        />
        <p
          id="contribution-amount-error"
          className="min-h-5 text-xs text-pretty text-muted-foreground"
        >
          {revealed.amount && errors.amount ? (
            <span className="text-destructive">{errors.amount}</span>
          ) : (
            <>
              Will post as{" "}
              <MoneyText
                amount={Number.isFinite(parsedAmount) ? parsedAmount : 0}
                className="font-medium text-foreground"
              />
            </>
          )}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contribution-email">Confirmation email</Label>
        <Input
          id="contribution-email"
          type="email"
          autoComplete="email"
          value={email}
          aria-invalid={revealed.email && !!errors.email}
          aria-describedby="contribution-email-error"
          onBlur={() => reveal("email")}
          onChange={(event) => {
            setEmail(event.target.value)
            if (revealed.email) {
              setErrors(validate({ amount, email: event.target.value, confirmed }))
            }
          }}
        />
        <p
          id="contribution-email-error"
          className="min-h-5 text-xs text-pretty text-destructive"
        >
          {revealed.email && errors.email ? errors.email : null}
        </p>
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-2 text-sm">
          <Checkbox
            checked={confirmed}
            aria-invalid={revealed.confirmed && !!errors.confirmed}
            onCheckedChange={(value) => {
              const next = value === true
              setConfirmed(next)
              if (revealed.confirmed) {
                setErrors(validate({ amount, email, confirmed: next }))
              }
            }}
          />
          <span>The amount and folio are correct.</span>
        </label>
        <p className="min-h-5 text-xs text-pretty text-destructive">
          {revealed.confirmed && errors.confirmed ? errors.confirmed : null}
        </p>
      </div>

      <Button type="submit">Schedule contribution</Button>
    </form>
  )
}
