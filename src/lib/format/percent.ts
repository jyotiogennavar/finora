export function formatPercent(
  value: number,
  fractionDigits = 2,
  { signed = true }: { signed?: boolean } = {}
): string {
  const magnitude = Math.abs(value).toFixed(fractionDigits)
  if (!signed) return `${magnitude}%`
  const sign = value > 0 ? "+" : value < 0 ? "−" : ""
  return `${sign}${magnitude}%`
}
