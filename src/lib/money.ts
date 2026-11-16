export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function roundUnits(value: number): number {
  return Math.round((value + Number.EPSILON) * 1000) / 1000
}

export function roundCost(value: number): number {
  return Math.round((value + Number.EPSILON) * 10000) / 10000
}
