"use client"

import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { TimeRangeSelector } from "@/components/charts/time-range-selector"
import { PageHeader } from "@/components/layout/page-header"
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
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { priceAsOf, simulatedDataNotice } from "@/constants/market"
import { clearAddedClients } from "@/features/clients/added-clients"
import {
  clearWorkspaceSettings,
  updateWorkspaceSettings,
  useWorkspaceSettings,
  type AdvisorProfile,
} from "@/features/settings/workspace-settings"
import { formatDisplayDate } from "@/lib/format/date"
import { cn } from "@/lib/utils"

type BenchmarkOption = {
  id: string
  name: string
  symbol: string
}

type FieldName = keyof AdvisorProfile
type FieldErrors = Partial<Record<FieldName, string>>

export function SettingsView({ benchmarks }: { benchmarks: BenchmarkOption[] }) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Settings"
        description="Advisor profile, how the workspace looks, and how the book is read."
      />
      <ProfileCard />
      <PreferencesCard />
      <DataCard benchmarks={benchmarks} />
    </div>
  )
}

function ProfileCard() {
  const settings = useWorkspaceSettings()
  const [draft, setDraft] = useState<AdvisorProfile | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const profile = draft ?? settings.profile

  function update<K extends FieldName>(key: K, value: AdvisorProfile[K]) {
    setDraft((current) => ({ ...(current ?? profile), [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = {
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      firm: profile.firm.trim(),
      registration: profile.registration.trim(),
      city: profile.city.trim(),
    }
    const nextErrors = validateProfile(next)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    updateWorkspaceSettings({ profile: next })
    setDraft(null)
    toast.success("Profile saved on this browser.")
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="font-heading text-base leading-snug font-medium text-balance">
          Advisor profile
        </h2>
        <CardDescription>
          The name shown in the header. Saved on this browser, not on a server.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="advisor-profile" onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Field label="Name" id="advisor-name" error={errors.name}>
            <Input
              id="advisor-name"
              name="name"
              autoComplete="name"
              value={profile.name}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "advisor-name-error" : undefined}
              onChange={(event) => update("name", event.target.value)}
            />
          </Field>
          <Field label="Email" id="advisor-email" error={errors.email}>
            <Input
              id="advisor-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              value={profile.email}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "advisor-email-error" : undefined}
              onChange={(event) => update("email", event.target.value)}
            />
          </Field>
          <Field label="Phone" id="advisor-phone" error={errors.phone} hint="Optional.">
            <Input
              id="advisor-phone"
              name="tel"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              spellCheck={false}
              value={profile.phone}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={describedBy("advisor-phone", errors.phone, true)}
              onChange={(event) => update("phone", event.target.value)}
            />
          </Field>
          <Field label="Firm" id="advisor-firm" error={errors.firm}>
            <Input
              id="advisor-firm"
              name="organization"
              autoComplete="organization"
              value={profile.firm}
              aria-invalid={errors.firm ? true : undefined}
              aria-describedby={errors.firm ? "advisor-firm-error" : undefined}
              onChange={(event) => update("firm", event.target.value)}
            />
          </Field>
          <Field
            label="Registration number"
            id="advisor-registration"
            hint="RIA or ARN. Optional."
          >
            <Input
              id="advisor-registration"
              name="registration"
              autoComplete="off"
              spellCheck={false}
              value={profile.registration}
              aria-describedby="advisor-registration-hint"
              onChange={(event) => update("registration", event.target.value)}
            />
          </Field>
          <Field label="City" id="advisor-city" hint="Optional.">
            <Input
              id="advisor-city"
              name="city"
              autoComplete="address-level2"
              value={profile.city}
              aria-describedby="advisor-city-hint"
              onChange={(event) => update("city", event.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit">Save profile</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function PreferencesCard() {
  const settings = useWorkspaceSettings()
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  const appearance = mounted ? (theme ?? "system") : "system"

  return (
    <Card>
      <CardHeader>
        <h2 className="font-heading text-base leading-snug font-medium text-balance">
          Preferences
        </h2>
        <CardDescription>
          Appearance and the range charts use when you open them.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label id="appearance-label">Appearance</Label>
          <div
            role="radiogroup"
            aria-labelledby="appearance-label"
            className="inline-flex h-10 select-none items-center rounded-lg bg-muted p-1 text-muted-foreground"
          >
            {(
              [
                ["light", "Light"],
                ["dark", "Dark"],
                ["system", "System"],
              ] as const
            ).map(([value, label]) => {
              const selected = appearance === value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={cn(
                    "relative h-8 rounded-[min(var(--radius-md),12px)] px-3 text-[0.8rem] font-medium outline-none transition-[color,background-color,transform] duration-150 ease-out before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] active:scale-[0.96] focus-visible:ring-3 focus-visible:ring-ring/50",
                    selected
                      ? "bg-background text-foreground"
                      : "[@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
                  )}
                  onClick={() => setTheme(value)}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label id="chart-range-label">Default chart range</Label>
          <TimeRangeSelector
            value={settings.chartRange}
            onChange={(chartRange) => updateWorkspaceSettings({ chartRange })}
            labelledBy="chart-range-label"
            className="self-start"
          />
          <p id="chart-range-hint" className="text-xs leading-5 text-muted-foreground">
            Charts open on this range until you pick another on the page.
          </p>
        </div>

        <ToggleRow
          id="compact-money"
          label="Compact amounts"
          description="Show lakhs and crores instead of the full rupee figure."
          checked={settings.compactMoney}
          onCheckedChange={(compactMoney) => updateWorkspaceSettings({ compactMoney })}
        />
        <ToggleRow
          id="review-reminder"
          label="Review reminder"
          description="Saved on this browser. Nothing is sent."
          checked={settings.reviewReminder}
          onCheckedChange={(reviewReminder) =>
            updateWorkspaceSettings({ reviewReminder })
          }
        />
      </CardContent>
    </Card>
  )
}

function DataCard({ benchmarks }: { benchmarks: BenchmarkOption[] }) {
  const settings = useWorkspaceSettings()
  const selected =
    benchmarks.find((item) => item.id === settings.benchmarkId) ?? benchmarks[0]
  const [resetOpen, setResetOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <h2 className="font-heading text-base leading-snug font-medium text-balance">
          Data configuration
        </h2>
        <CardDescription>
          What the book is measured in, and which benchmark opens with analytics.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <dt className="text-sm text-muted-foreground">Currency</dt>
            <dd className="text-sm font-medium">Indian rupee (INR)</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-muted-foreground">Mark date</dt>
            <dd className="text-sm font-medium">{formatDisplayDate(priceAsOf)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-muted-foreground">Source</dt>
            <dd className="text-sm font-medium">Simulated</dd>
          </div>
        </dl>
        <p className="max-w-prose text-sm leading-6 text-pretty text-muted-foreground">
          {simulatedDataNotice}
        </p>

        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="default-benchmark">Default benchmark</Label>
          <Select
            value={selected?.id ?? ""}
            onValueChange={(value) => {
              if (value) updateWorkspaceSettings({ benchmarkId: String(value) })
            }}
          >
            <SelectTrigger id="default-benchmark" className="w-full text-base md:text-sm">
              <span className="line-clamp-1 flex flex-1 text-left">
                {selected ? `${selected.name} (${selected.symbol})` : "Choose a benchmark"}
              </span>
            </SelectTrigger>
            <SelectContent>
              {benchmarks.map((benchmark) => (
                <SelectItem key={benchmark.id} value={benchmark.id}>
                  {benchmark.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs leading-5 text-muted-foreground">
            Analytics opens on this benchmark until you pick another there.
          </p>
        </div>

        <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            Reset local data
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset local data?</AlertDialogTitle>
              <AlertDialogDescription>
                Clears the saved profile, preferences, and clients added in this
                browser. The sample book stays.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep data</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => {
                  clearWorkspaceSettings()
                  clearAddedClients()
                  setResetOpen(false)
                  toast.success("Local changes cleared.")
                }}
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <Label htmlFor={id}>{label}</Label>
        <p id={`${id}-hint`} className="text-sm leading-6 text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-describedby={`${id}-hint`}
      />
    </div>
  )
}

function Field({
  label,
  id,
  error,
  hint,
  children,
}: {
  label: string
  id: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

function describedBy(id: string, error: string | undefined, hint: boolean) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

function validateProfile(profile: AdvisorProfile): FieldErrors {
  const errors: FieldErrors = {}
  if (!profile.name) errors.name = "Enter a name."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.email = "Email needs an @ and a domain."
  }
  if (!profile.firm) errors.firm = "Enter a firm."
  if (profile.phone) {
    const digits = profile.phone.replace(/\D/g, "")
    if (digits.length < 10) errors.phone = "Phone needs at least 10 digits."
  }
  return errors
}
