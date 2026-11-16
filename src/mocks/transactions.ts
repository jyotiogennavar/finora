import type { Transaction } from "@/features/transactions/types";
import { mockAssets } from "./assets";
import { mockHoldings } from "./holdings";
import { mockPortfolios } from "./portfolios";

// All monetary values are simulated INR values.
const assetMap = new Map(mockAssets.map((asset) => [asset.id, asset]));

const dateFromOffset = (days: number) => {
  const date = new Date(Date.UTC(2025, 10, 1 + days, 10, 0, 0));
  return date.toISOString();
};

const roundAmount = (value: number) => Number(value.toFixed(2));

const makeTransaction = (
  transaction: Omit<Transaction, "createdAt">
): Transaction => ({
  ...transaction,
  createdAt: transaction.transactionDate,
});

// 1. BUY transactions: one for every existing holding.
const buyTransactions: Transaction[] = mockHoldings.map((holding, index) => {
  const amount = roundAmount(holding.quantity * holding.averageBuyPrice);

  return makeTransaction({
    id: `TXN${String(index + 1).padStart(3, "0")}`,
    transactionCode: `FIN-TXN-${String(index + 1).padStart(4, "0")}`,

    portfolioId: holding.portfolioId,
    assetId: holding.assetId,

    type: "BUY",
    status: "COMPLETED",

    quantity: holding.quantity,
    price: holding.averageBuyPrice,

    amount,
    charges: roundAmount(amount * 0.001),

    currency: "INR",
    transactionDate: dateFromOffset(5 + index * 2),

    description: "Investment purchase",
  });
});

// 2. DEPOSIT transactions: one per portfolio.
// Each deposit covers the portfolio's purchases and
// leaves an illustrative cash reserve of INR 50,000.
const depositTransactions: Transaction[] = mockPortfolios.map(
  (portfolio, index) => {
    const portfolioBuys = buyTransactions.filter(
      (transaction) => transaction.portfolioId === portfolio.id
    );

    const purchaseTotal = portfolioBuys.reduce(
      (total, transaction) => total + transaction.amount + transaction.charges,
      0
    );

    return makeTransaction({
      id: `TXN${String(101 + index).padStart(3, "0")}`,
      transactionCode: `FIN-TXN-${String(101 + index).padStart(4, "0")}`,

      portfolioId: portfolio.id,

      type: "DEPOSIT",
      status: "COMPLETED",

      amount: roundAmount(purchaseTotal + 50000),
      charges: 0,

      currency: "INR",
      transactionDate: dateFromOffset(0),

      description: "Initial portfolio funding",
    });
  }
);

// 3. WITHDRAWAL transactions: 10 portfolios.
const withdrawalTransactions: Transaction[] = mockPortfolios
  .slice(0, 10)
  .map((portfolio, index) =>
    makeTransaction({
      id: `TXN${String(121 + index).padStart(3, "0")}`,
      transactionCode: `FIN-TXN-${String(121 + index).padStart(4, "0")}`,

      portfolioId: portfolio.id,

      type: "WITHDRAWAL",
      status: "COMPLETED",

      amount: 5000 + index * 1000,
      charges: 0,

      currency: "INR",
      transactionDate: dateFromOffset(280 + index * 3),

      description: "Partial portfolio withdrawal",
    })
  );

// 4. DIVIDEND transactions: 10 equity holdings.
const dividendTransactions: Transaction[] = mockPortfolios
  .slice(0, 10)
  .map((portfolio, index) => {
    const equityHolding = mockHoldings.find(
      (holding) =>
        holding.portfolioId === portfolio.id &&
        assetMap.get(holding.assetId)?.assetClass === "EQUITY"
    );

    if (!equityHolding) {
      throw new Error(`No equity holding found for ${portfolio.id}`);
    }

    return makeTransaction({
      id: `TXN${String(131 + index).padStart(3, "0")}`,
      transactionCode: `FIN-TXN-${String(131 + index).padStart(4, "0")}`,

      portfolioId: portfolio.id,
      assetId: equityHolding.assetId,

      type: "DIVIDEND",
      status: "COMPLETED",

      amount: 1200 + index * 175,
      charges: 0,

      currency: "INR",
      transactionDate: dateFromOffset(310 + index * 2),

      description: "Dividend received",
    });
  });

// 5. INTEREST transactions: 10 portfolios with debt holdings.
// POR007 replaces POR010: POR010's sleeve has no debt instrument.
const debtPortfolioIds = [
  "POR001",
  "POR002",
  "POR003",
  "POR004",
  "POR006",
  "POR007",
  "POR008",
  "POR009",
  "POR011",
  "POR013",
];

const interestTransactions: Transaction[] = debtPortfolioIds.map(
  (portfolioId, index) => {
    const debtHolding = mockHoldings.find(
      (holding) =>
        holding.portfolioId === portfolioId &&
        assetMap.get(holding.assetId)?.assetClass === "DEBT"
    );

    if (!debtHolding) {
      throw new Error(`No debt holding found for ${portfolioId}`);
    }

    return makeTransaction({
      id: `TXN${String(141 + index).padStart(3, "0")}`,
      transactionCode: `FIN-TXN-${String(141 + index).padStart(4, "0")}`,

      portfolioId,
      assetId: debtHolding.assetId,

      type: "INTEREST",
      status: "COMPLETED",

      amount: 800 + index * 125,
      charges: 0,

      currency: "INR",
      transactionDate: dateFromOffset(340 + index * 2),

      description: "Interest income received",
    });
  }
);

// Combined transaction history, sorted chronologically.
export const mockTransactions: Transaction[] = [
  ...buyTransactions,
  ...depositTransactions,
  ...withdrawalTransactions,
  ...dividendTransactions,
  ...interestTransactions,
].sort(
  (a, b) =>
    new Date(a.transactionDate).getTime() -
    new Date(b.transactionDate).getTime()
);
