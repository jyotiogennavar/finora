import type { Benchmark } from "@/features/analytics/types";

export const mockBenchmarks: Benchmark[] = [
  {
    id: "BMK001",
    name: "NIFTY 50",
    symbol: "NIFTY50",
    description: "NSE large-cap equity benchmark",
  },
  {
    id: "BMK002",
    name: "BSE SENSEX",
    symbol: "SENSEX",
    description: "BSE large-cap equity benchmark",
  },
  {
    id: "BMK003",
    name: "NIFTY 500",
    symbol: "NIFTY500",
    description: "Broad Indian equity market benchmark",
  },
  {
    id: "BMK004",
    name: "NIFTY 10 Year Benchmark G-Sec",
    symbol: "NIFTY10Y",
    description: "Indian government bond benchmark",
  },
];
