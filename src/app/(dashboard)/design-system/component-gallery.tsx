"use client"

import { useState } from "react"
import { format } from "date-fns"
import { IconCalendar, IconSearch } from "@tabler/icons-react"

import { ChartsSection } from "@/app/(dashboard)/design-system/charts"
import { DataDisplaySection } from "@/app/(dashboard)/design-system/data-display"
import { FinancialUiSection } from "@/app/(dashboard)/design-system/financial-ui"
import { InteractionsSection } from "@/app/(dashboard)/design-system/interactions"
import { NavigationSection } from "@/app/(dashboard)/design-system/navigation"
import { PolishSection } from "@/app/(dashboard)/design-system/polish"
import { Section, Specimen } from "@/app/(dashboard)/design-system/specimen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ComponentGallery() {
  return (
    <div className="space-y-12">
      <Section
        id="buttons"
        title="Foundations · Buttons"
        description="One primary action per view. Outline and ghost recede; destructive is only for irreversible work."
      >
        <Specimen className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </Specimen>
      </Section>

      <Section
        id="badges"
        title="Foundations · Badges"
        description="Status chips. Prefer the named financial badges in section 03 over raw color utilities."
      >
        <Specimen className="flex flex-wrap gap-2">
          <Badge className="bg-active/15 text-active">Active</Badge>
          <Badge className="bg-pending/15 text-pending">Pending</Badge>
          <Badge className="bg-success/15 text-success">Completed</Badge>
          <Badge className="bg-negative/15 text-negative">Failed</Badge>
        </Specimen>
      </Section>

      <Section
        id="inputs"
        title="Foundations · Inputs"
        description="Every field has a visible label. Input text stays at 16px on small screens."
      >
        <Specimen>
          <InputFields />
        </Specimen>
      </Section>

      <FinancialUiSection />
      <DataDisplaySection />
      <ChartsSection />
      <NavigationSection />
      <InteractionsSection />
      <PolishSection />
    </div>
  )
}

function InputFields() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 31))

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="client-name">Client name</Label>
        <Input id="client-name" placeholder="Aarav Mehta" autoComplete="name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-search">Search</Label>
        <InputGroup>
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          <InputGroupInput
            id="client-search"
            type="search"
            placeholder="Search clients"
            autoComplete="off"
            spellCheck={false}
          />
        </InputGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="asset-class">Asset class</Label>
        <Select defaultValue="equity">
          <SelectTrigger id="asset-class" className="w-full text-base md:text-sm">
            <SelectValue placeholder="Choose an asset class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equity">Equity</SelectItem>
            <SelectItem value="debt">Debt</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="as-of-date">As of date</Label>
        <Popover>
          <PopoverTrigger
            id="as-of-date"
            render={
              <Button
                variant="outline"
                className="w-full justify-start px-2.5 font-normal text-base md:text-sm"
              />
            }
          >
            <IconCalendar />
            {date ? format(date, "d MMM yyyy") : "Pick a date"}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
