import type { DashboardOverview } from "../types";
import { attentionKind } from "../attention";

import {
  mockAssets,
  mockClients,
  mockPortfolios,
  mockHoldings,
  mockTransactions,
  mockPortfolioPerformance,
} from "@/mocks";

import { calculatePortfolioValuation } from "@/lib/calculations/portfolio";
import { calculateAllocation } from "@/lib/calculations/allocation";
import { fullName } from "@/lib/format/labels";

export function getDashboardOverview(): DashboardOverview {
  // Calculate each portfolio independently.
  const portfolioMetrics = mockPortfolios.map((portfolio) => {
    const metrics = calculatePortfolioValuation(
      portfolio.id,
      mockHoldings,
      mockTransactions
    );

    return {
      portfolio,
      metrics,
    };
  });

  // Aggregate portfolio metrics.
  const totalAum = portfolioMetrics.reduce(
    (total, item) => total + item.metrics.currentValue,
    0
  );

  const netContributions = portfolioMetrics.reduce(
    (total, item) => total + item.metrics.netContributions,
    0
  );

  const totalProfitLoss = portfolioMetrics.reduce(
    (total, item) => total + item.metrics.absoluteReturn,
    0
  );

  const totalCash = portfolioMetrics.reduce(
    (total, item) => total + item.metrics.cashBalance,
    0
  );

  const holdingsCount = portfolioMetrics.reduce(
    (total, item) => total + item.metrics.holdingsCount,
    0
  );

  // Asset allocation across all managed portfolios.
  const allocation = calculateAllocation(mockHoldings, mockAssets, totalCash);

  // Aggregate historical AUM across all portfolios.
  const performanceHistory = Array.from({ length: 12 }, (_, index) => {
    const totalValue = mockPortfolioPerformance.reduce(
      (total, performance) => total + performance.history[index].value,
      0
    );

    return {
      date: mockPortfolioPerformance[0]?.history[index]?.date ?? "",
      value: Number(totalValue.toFixed(2)),
    };
  });

  // Client deposits and withdrawals. Buys and sells stay inside the book.
  let inflows = 0;
  let outflows = 0;
  let inflowCount = 0;
  let outflowCount = 0;

  for (const transaction of mockTransactions) {
    if (transaction.status !== "COMPLETED") continue;

    if (transaction.type === "DEPOSIT") {
      inflows += transaction.amount;
      inflowCount += 1;
    } else if (transaction.type === "WITHDRAWAL") {
      outflows += transaction.amount;
      outflowCount += 1;
    }
  }

  // Client-level AUM, equity weight, and return versus contributions.
  const clientBooks = mockClients.flatMap((client) => {
    const clientPortfolios = portfolioMetrics.filter(
      (item) => item.portfolio.clientId === client.id
    );

    if (clientPortfolios.length === 0 && client.status === "ACTIVE") {
      return [];
    }

    const portfolioIds = new Set(
      clientPortfolios.map((item) => item.portfolio.id)
    );

    const contributions = clientPortfolios.reduce(
      (total, item) => total + item.metrics.netContributions,
      0
    );

    const profitLoss = clientPortfolios.reduce(
      (total, item) => total + item.metrics.absoluteReturn,
      0
    );

    const cash = clientPortfolios.reduce(
      (total, item) => total + item.metrics.cashBalance,
      0
    );

    const holdings = mockHoldings.filter((holding) =>
      portfolioIds.has(holding.portfolioId)
    );

    const equityPercentage =
      calculateAllocation(holdings, mockAssets, cash).find(
        (item) => item.assetClass === "EQUITY"
      )?.percentage ?? 0;

    return [
      {
        client,
        portfolioCount: clientPortfolios.length,
        totalAum: clientPortfolios.reduce(
          (total, item) => total + item.metrics.currentValue,
          0
        ),
        equityPercentage,
        returnPercentage:
          contributions > 0 ? (profitLoss / contributions) * 100 : 0,
      },
    ];
  });

  const topClients = clientBooks
    .filter((item) => item.portfolioCount > 0)
    .map((item) => ({
      clientId: item.client.id,
      clientName: fullName(item.client.firstName, item.client.lastName),
      portfolioCount: item.portfolioCount,
      totalAum: item.totalAum,
      riskProfile: item.client.riskProfile,
    }))
    .sort((a, b) => b.totalAum - a.totalAum)
    .slice(0, 5);

  const attention = clientBooks
    .flatMap((item) => {
      const assessed = attentionKind({
        status: item.client.status,
        riskProfile: item.client.riskProfile,
        equityPercentage: item.equityPercentage,
        returnPercentage: item.returnPercentage,
      });

      if (!assessed) return [];

      return [
        {
          severity: assessed.severity,
          clientId: item.client.id,
          firstName: item.client.firstName,
          lastName: item.client.lastName,
          riskProfile: item.client.riskProfile,
          status: item.client.status,
          totalAum: item.totalAum,
          equityPercentage: item.equityPercentage,
          returnPercentage: item.returnPercentage,
          kind: assessed.kind,
        },
      ];
    })
    .sort((a, b) => b.severity - a.severity || b.totalAum - a.totalAum)
    .map((item) => ({
      clientId: item.clientId,
      firstName: item.firstName,
      lastName: item.lastName,
      riskProfile: item.riskProfile,
      status: item.status,
      totalAum: item.totalAum,
      equityPercentage: item.equityPercentage,
      returnPercentage: item.returnPercentage,
      kind: item.kind,
    }));

  // Largest portfolios.
  const topPortfolios = portfolioMetrics
    .map(({ portfolio, metrics }) => {
      const client = mockClients.find((item) => item.id === portfolio.clientId);

      return {
        portfolioId: portfolio.id,
        portfolioName: portfolio.name,
        clientName: client
          ? `${client.firstName} ${client.lastName}`
          : "Unknown client",
        currentValue: metrics.currentValue,
        returnPercentage: metrics.returnPercentage,
      };
    })
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, 5);

  const portfoliosById = new Map(
    mockPortfolios.map((portfolio) => [portfolio.id, portfolio])
  );
  const clientsById = new Map(mockClients.map((client) => [client.id, client]));

  // Most recent settled activity.
  const recentActivity = [...mockTransactions]
    .filter((transaction) => transaction.status === "COMPLETED")
    .sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    )
    .slice(0, 6)
    .map((transaction) => {
      const portfolio = portfoliosById.get(transaction.portfolioId);
      const client = portfolio
        ? clientsById.get(portfolio.clientId)
        : undefined;

      return {
        transaction,
        clientName: client
          ? fullName(client.firstName, client.lastName)
          : "Unknown client",
        portfolioName: portfolio?.name ?? "Unknown portfolio",
      };
    });

  return {
    summary: {
      totalAum,
      netContributions,
      totalProfitLoss,
      totalReturnPercentage:
        netContributions > 0 ? (totalProfitLoss / netContributions) * 100 : 0,

      clientCount: mockClients.length,
      activeClientCount: mockClients.filter((client) => client.status === "ACTIVE")
        .length,

      portfolioCount: mockPortfolios.length,
      activePortfolioCount: mockPortfolios.filter(
        (portfolio) => portfolio.status === "ACTIVE"
      ).length,

      holdingsCount,
    },

    flows: {
      inflows,
      outflows,
      inflowCount,
      outflowCount,
    },
    allocation,
    performanceHistory,
    topClients,
    topPortfolios,
    attention,
    recentActivity,
  };
}
