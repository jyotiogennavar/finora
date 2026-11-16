export const baseCurrency = "INR" as const
export type CurrencyCode = typeof baseCurrency

export const numberLocale = "en-IN" as const

export const exchanges = ["NSE", "BSE"] as const
export type Exchange = (typeof exchanges)[number]

export const assetClasses = ["equity", "debt", "hybrid", "gold"] as const
export type AssetClass = (typeof assetClasses)[number]

/** Only source allowed on prices and index levels in this dataset. */
export const simulatedDataSource = "simulated" as const
export type MarketDataSource = typeof simulatedDataSource

/** Mark date for simulated prices, NAVs, and index levels. */
export const priceAsOf = "2026-10-31"

export const performanceMonthEnds = [
  "2025-11-30",
  "2025-12-31",
  "2026-01-31",
  "2026-02-28",
  "2026-03-31",
  "2026-04-30",
  "2026-05-31",
  "2026-06-30",
  "2026-07-31",
  "2026-08-31",
  "2026-09-30",
  "2026-10-31",
] as const

export const simulatedDataNotice =
  "Prices, NAVs, index levels, and valuations in this dataset are simulated for product development. They are not live or historical market data."

export const taxContext = {
  jurisdiction: "IN",
  residencyStatuses: ["resident_individual", "huf", "nri"],
  contractNoteComponents: ["brokerage", "stt", "stamp_duty", "gst"],
} as const

export type TaxStatus = (typeof taxContext.residencyStatuses)[number]

/**
 * Illustrative rates for simulated contract notes.
 * Capital-gains tax is not stored; it has to be derived from trade dates and prices.
 */
export const simulatedChargeRates = {
  equityBrokerageRate: 0.0003,
  minimumBrokerage: 20,
  sttRate: 0.001,
  equityStampDutyBuyRate: 0.00015,
  mutualFundStampDutyBuyRate: 0.00005,
  gstOnBrokerageRate: 0.18,
} as const
