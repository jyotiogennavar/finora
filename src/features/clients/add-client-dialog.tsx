"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { entityStatusLabels, riskProfileLabels } from "@/lib/format/labels"
import { cn } from "@/lib/utils"
import type { EntityStatus, RiskProfile } from "@/types/common"

export type NewClientInput = {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  occupation: string
  riskProfile: RiskProfile
  status: EntityStatus
}

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  occupation: string
  riskProfile: RiskProfile | null
  status: EntityStatus
}

type FieldName = keyof FormState
type FieldErrors = Partial<Record<FieldName, string>>

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  occupation: "",
  riskProfile: null,
  status: "ACTIVE",
}

const fieldOrder: FieldName[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "dateOfBirth",
  "occupation",
  "riskProfile",
  "status",
]

function todayIso() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

function validate(form: FormState, emailTaken: (email: string) => boolean) {
  const errors: FieldErrors = {}
  if (!form.firstName.trim()) errors.firstName = "Enter a first name."
  if (!form.lastName.trim()) errors.lastName = "Enter a last name."

  const email = form.email.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email needs an @ and a domain."
  } else if (emailTaken(email)) {
    errors.email = "This email is already on the book."
  }

  const digits = form.phone.replace(/\D/g, "")
  if (digits.length < 10) errors.phone = "Phone needs at least 10 digits."

  if (!form.dateOfBirth) {
    errors.dateOfBirth = "Enter a date of birth."
  } else if (form.dateOfBirth > todayIso()) {
    errors.dateOfBirth = "Date of birth can't be in the future."
  } else if (form.dateOfBirth < "1900-01-01") {
    errors.dateOfBirth = "Enter a real date of birth."
  }

  if (!form.riskProfile) errors.riskProfile = "Select a risk profile."

  return errors
}

export function AddClientDialog({
  onCreate,
  emailTaken,
}: {
  onCreate: (input: NewClientInput) => void
  emailTaken: (email: string) => boolean
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<FieldErrors>({})

  function update<K extends FieldName>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setForm(emptyForm)
      setErrors({})
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(form, emailTaken)
    setErrors(nextErrors)
    const firstInvalid = fieldOrder.find((field) => nextErrors[field])
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }
    if (!form.riskProfile) return

    onCreate({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      dateOfBirth: form.dateOfBirth,
      occupation: form.occupation.trim(),
      riskProfile: form.riskProfile,
      status: form.status,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <IconPlus />
        Add client
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add client</DialogTitle>
          <DialogDescription>
            Saved in this browser session.
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-client-form"
          noValidate
          onSubmit={onSubmit}
          className="grid max-h-[min(32rem,calc(100dvh-12rem))] gap-4 overflow-y-auto sm:grid-cols-2"
        >
          <Field label="First name" id="firstName" error={errors.firstName}>
            <Input
              id="firstName"
              name="given-name"
              autoComplete="given-name"
              autoFocus
              value={form.firstName}
              aria-invalid={errors.firstName ? true : undefined}
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
              onChange={(event) => update("firstName", event.target.value)}
            />
          </Field>
          <Field label="Last name" id="lastName" error={errors.lastName}>
            <Input
              id="lastName"
              name="family-name"
              autoComplete="family-name"
              value={form.lastName}
              aria-invalid={errors.lastName ? true : undefined}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              onChange={(event) => update("lastName", event.target.value)}
            />
          </Field>
          <Field
            label="Email"
            id="email"
            error={errors.email}
            className="sm:col-span-2"
          >
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              value={form.email}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              onChange={(event) => update("email", event.target.value)}
            />
          </Field>
          <Field label="Phone" id="phone" error={errors.phone}>
            <Input
              id="phone"
              name="tel"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              spellCheck={false}
              value={form.phone}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              onChange={(event) => update("phone", event.target.value)}
            />
          </Field>
          <Field
            label="Date of birth"
            id="dateOfBirth"
            error={errors.dateOfBirth}
          >
            <Input
              id="dateOfBirth"
              name="bday"
              type="date"
              autoComplete="bday"
              value={form.dateOfBirth}
              max={todayIso()}
              aria-invalid={errors.dateOfBirth ? true : undefined}
              aria-describedby={
                errors.dateOfBirth ? "dateOfBirth-error" : undefined
              }
              onChange={(event) => update("dateOfBirth", event.target.value)}
            />
          </Field>
          <Field
            label="Occupation"
            id="occupation"
            error={errors.occupation}
            className="sm:col-span-2"
          >
            <Input
              id="occupation"
              name="organization-title"
              autoComplete="organization-title"
              value={form.occupation}
              aria-invalid={errors.occupation ? true : undefined}
              aria-describedby={
                errors.occupation ? "occupation-error" : undefined
              }
              onChange={(event) => update("occupation", event.target.value)}
            />
          </Field>
          <Field
            label="Risk profile"
            id="riskProfile"
            error={errors.riskProfile}
          >
            <Select
              value={form.riskProfile}
              onValueChange={(value) => {
                if (value) update("riskProfile", value as RiskProfile)
              }}
            >
              <SelectTrigger
                id="riskProfile"
                className="w-full text-base md:text-sm"
                aria-invalid={errors.riskProfile ? true : undefined}
                aria-describedby={
                  errors.riskProfile ? "riskProfile-error" : undefined
                }
              >
                <span
                  className={cn(
                    "line-clamp-1 flex flex-1 text-left",
                    form.riskProfile ? undefined : "text-muted-foreground"
                  )}
                >
                  {form.riskProfile
                    ? riskProfileLabels[form.riskProfile]
                    : "Select a profile"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(riskProfileLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status" id="status" error={errors.status}>
            <Select
              value={form.status}
              onValueChange={(value) => {
                if (value) update("status", value as EntityStatus)
              }}
            >
              <SelectTrigger
                id="status"
                className="w-full text-base md:text-sm"
              >
                <span className="line-clamp-1 flex flex-1 text-left">
                  {entityStatusLabels[form.status]}
                </span>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(entityStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" type="button" />}>
            Cancel
          </DialogClose>
          <Button type="submit" form="add-client-form">
            Add client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  id,
  error,
  className,
  children,
}: {
  label: string
  id: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
