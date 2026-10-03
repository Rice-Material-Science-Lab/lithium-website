"use client"

import {
  ChartLegend,
  ChartLegendContent,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"

export default function AtomCountsChart({
  data,
}: {
  data: {
    deposited: number
    empty: number
    fill: number
    free: number
    passivated: number
    step: number
    substrate: number
    time: number
    total_rate: number
  }[]
}) {
  const [mounted, setMounted] = useState(false)

  // Series colours are theme tokens (app/globals.css): they follow
  // light/dark mode on their own and match the lattice.
  const chartConfig = {
    free: { label: "Free", color: "var(--lattice-free)" },
    deposited: { label: "Deposited", color: "var(--lattice-deposited)" },
    passivated: { label: "Passivated", color: "var(--lattice-passivated)" },
  } satisfies ChartConfig

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(handle)
  }, [])

  return mounted ? (
    <div className="flex h-full min-h-0 w-full flex-col gap-2">
      <h3 className="text-center text-sm font-medium text-muted-foreground">
        Atom counts over time
      </h3>
      <div className="min-h-0 w-full flex-1">
        {data.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full min-h-0 w-full"
          >
            <LineChart
              data={data}
              margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />

              <XAxis
                dataKey="step"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <YAxis
                domain={[0, "auto"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="free"
                stroke="var(--color-free)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="deposited"
                stroke="var(--color-deposited)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="passivated"
                stroke="var(--color-passivated)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No data yet. Run the simulation to see atom counts.
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      Loading...
    </div>
  )
}
