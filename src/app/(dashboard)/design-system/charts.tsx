"use client"

import { useState } from "react"

import { AllocationChart } from "@/components/charts/allocation-chart"
import { BenchmarkChart } from "@/components/charts/benchmark-chart"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { ReturnsChart } from "@/components/charts/returns-chart"
import {
  sliceByTimeRange,
  TimeRangeSelector,
  type TimeRange,
} from "@/components/charts/time-range-selector"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { portfolio, specimenReturns } from "./specimen-data"
import { Section, Subheading } from "./specimen"

export function ChartsSection() {
  const [range, setRange] = useState<TimeRange>("1Y")
  const history = portfolio.performance?.history ?? []
  const benchmarkHistory = portfolio.benchmarkPerformance?.history ?? []
  const rangedHistory = sliceByTimeRange(history, range)
  const rangedBenchmark = sliceByTimeRange(benchmarkHistory, range)

  return (
    <Section
      id="charts"
      title="05. Charts"
      description="One series per chart unless the comparison is the point. Axes use compact INR or an index of 100."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Subheading>Time range</Subheading>
        <TimeRangeSelector value={range} onChange={setRange} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio performance</CardTitle>
            <CardDescription>
              {portfolio.portfolio.name}, marked to simulated prices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={rangedHistory} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset allocation</CardTitle>
            <CardDescription>Current mix including cash</CardDescription>
          </CardHeader>
          <CardContent>
            <AllocationChart items={portfolio.allocation} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Benchmark comparison</CardTitle>
            <CardDescription>
              Indexed to 100 at the start of the range
              {portfolio.benchmark ? ` · ${portfolio.benchmark.name}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BenchmarkChart
              portfolio={rangedHistory}
              benchmark={rangedBenchmark}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Returns</CardTitle>
            <CardDescription>Period return from the same series</CardDescription>
          </CardHeader>
          <CardContent>
            <ReturnsChart data={specimenReturns} />
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
