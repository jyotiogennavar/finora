import type { Holding } from "@/features/portfolios/types";
import type { Transaction } from "@/features/transactions/types";

import {
  calculateAbsoluteReturn,
  calculateReturnPercentage,
} from "./returns";

export function calculatePortfolioCashBalance(
  portfolioId: string,
  transactions: Transaction[]
): number {
  return transactions
    .filter(
      (transaction) =>
        transaction.portfolioId === portfolioId &&
        transaction.status === "COMPLETED"
    )
    .reduce((balance, transaction) => {
      switch (transaction.type) {
        case "DEPOSIT":
        case "DIVIDEND":
        case "INTEREST":
          return balance + transaction.amount;

        case "WITHDRAWAL":
          return balance - transaction.amount;

        case "BUY":
          return balance - transaction.amount - transaction.charges;

        case "SELL":
          return balance + transaction.amount - transaction.charges;

        default:
          return balance;
      }
    }, 0);
}

export function calculatePortfolioValuation(
  portfolioId: string,
  holdings: Holding[],
  transactions: Transaction[]
) {
  const portfolioHoldings = holdings.filter(
    (holding) => holding.portfolioId === portfolioId
  );

  const investedValue = portfolioHoldings.reduce(
    (total, holding) => total + holding.quantity * holding.averageBuyPrice,
    0
  );

  const marketValue = portfolioHoldings.reduce(
    (total, holding) => total + holding.quantity * holding.currentPrice,
    0
  );

  const cashBalance = calculatePortfolioCashBalance(portfolioId, transactions);

  const currentValue = marketValue + cashBalance;

  const netContributions = transactions
    .filter(
      (transaction) =>
        transaction.portfolioId === portfolioId &&
        transaction.status === "COMPLETED"
    )
    .reduce((total, transaction) => {
      if (transaction.type === "DEPOSIT") {
        return total + transaction.amount;
      }

      if (transaction.type === "WITHDRAWAL") {
        return total - transaction.amount;
      }

      return total;
    }, 0);

  const absoluteReturn = calculateAbsoluteReturn(
    currentValue,
    netContributions
  );

  const returnPercentage = calculateReturnPercentage(
    currentValue,
    netContributions
  );

  const unrealizedProfitLoss = calculateAbsoluteReturn(
    marketValue,
    investedValue
  );

  return {
    portfolioId,
    holdingsCount: portfolioHoldings.length,
    investedValue,
    marketValue,
    cashBalance,
    currentValue,
    netContributions,
    absoluteReturn,
    returnPercentage,
    unrealizedProfitLoss,
    unrealizedReturnPercentage: calculateReturnPercentage(
      marketValue,
      investedValue
    ),
  };
}
