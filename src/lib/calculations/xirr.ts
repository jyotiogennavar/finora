export type CashFlow = {
  date: string
  amount: number
}

const msPerYear = 365 * 24 * 60 * 60 * 1000

/**
 * Money-weighted return as a percentage.
 * Negative amounts are cash invested. Positive amounts are cash returned,
 * including the value still invested on the last date.
 * Returns null when the flows cannot be solved.
 */
export function calculateXirr(flows: CashFlow[]): number | null {
  const dated = flows
    .map((flow) => ({
      time: Date.parse(`${flow.date.slice(0, 10)}T00:00:00Z`),
      amount: flow.amount,
    }))
    .filter(
      (flow) =>
        Number.isFinite(flow.time) &&
        Number.isFinite(flow.amount) &&
        flow.amount !== 0
    )
    .sort((a, b) => a.time - b.time)

  if (dated.length < 2) return null
  if (!dated.some((flow) => flow.amount > 0)) return null
  if (!dated.some((flow) => flow.amount < 0)) return null

  const origin = dated[0].time
  const series = dated.map((flow) => ({
    amount: flow.amount,
    years: (flow.time - origin) / msPerYear,
  }))

  const npv = (rate: number) =>
    series.reduce(
      (total, flow) => total + flow.amount / (1 + rate) ** flow.years,
      0
    )

  const slope = (rate: number) =>
    series.reduce(
      (total, flow) =>
        total - (flow.years * flow.amount) / (1 + rate) ** (flow.years + 1),
      0
    )

  let rate = 0.1
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const value = npv(rate)
    if (!Number.isFinite(value)) break
    if (Math.abs(value) < 1e-7) return rate * 100
    const derivative = slope(rate)
    if (!Number.isFinite(derivative) || derivative === 0) break
    const next = rate - value / derivative
    if (!Number.isFinite(next) || next <= -0.9999) break
    rate = next
  }

  let low = -0.9
  let high = 1
  let lowValue = npv(low)
  let highValue = npv(high)

  for (let attempt = 0; attempt < 24 && lowValue * highValue > 0; attempt += 1) {
    high = high * 2 + 0.5
    highValue = npv(high)
    if (!Number.isFinite(highValue)) return null
  }

  if (!Number.isFinite(lowValue) || !Number.isFinite(highValue)) return null
  if (lowValue * highValue > 0) return null

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const mid = (low + high) / 2
    const value = npv(mid)
    if (!Number.isFinite(value)) return null
    if (Math.abs(value) < 1e-7 || high - low < 1e-8) return mid * 100
    if (value * lowValue > 0) {
      low = mid
      lowValue = value
    } else {
      high = mid
    }
  }

  return ((low + high) / 2) * 100
}
