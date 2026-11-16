import { baseCurrency, numberLocale } from "@/constants/market"

const formatters = new Map<number, Intl.NumberFormat>()

function formatter(fractionDigits: number) {
  const cached = formatters.get(fractionDigits)
  if (cached) return cached
  const created = new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: baseCurrency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
  formatters.set(fractionDigits, created)
  return created
}

/** Display helper. Stored amounts stay plain numbers in INR. */
export function formatInr(amount: number, fractionDigits = 2): string {
  return formatter(fractionDigits).format(amount)
}

export function formatSignedInr(amount: number, fractionDigits = 2): string {
  const formatted = formatInr(Math.abs(amount), fractionDigits)
  if (amount > 0) return `+${formatted}`
  if (amount < 0) return `−${formatted}`
  return formatted
}

export function formatCompactInr(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? "−" : ""

  if (abs >= 1_00_00_000) {
    return `${sign}₹${trimZeros(abs / 1_00_00_000)} Cr`
  }

  if (abs >= 1_00_000) {
    return `${sign}₹${trimZeros(abs / 1_00_000)} L`
  }

  return `${amount < 0 ? "−" : ""}${formatInr(abs, 0)}`
}

function trimZeros(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "")
}
