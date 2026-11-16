export function calculateAbsoluteReturn(
  currentValue: number,
  investedValue: number
): number {
  return currentValue - investedValue;
}

export function calculateReturnPercentage(
  currentValue: number,
  investedValue: number
): number {
  if (investedValue <= 0) return 0;

  return ((currentValue - investedValue) / investedValue) * 100;
}

export function calculateAnnualizedReturn(
  currentValue: number,
  investedValue: number,
  startDate: string,
  endDate: string
): number {
  if (currentValue <= 0 || investedValue <= 0) return 0;

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const days = (end - start) / (1000 * 60 * 60 * 24);

  if (days <= 0) return 0;

  return (Math.pow(currentValue / investedValue, 365 / days) - 1) * 100;
}
