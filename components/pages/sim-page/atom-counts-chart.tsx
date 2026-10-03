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

// Simulated KMC time is tiny (often 1e-6..1e-2 s): show compact, readable
// ticks that stay sensible as the axis stretches.
function formatSimTime(t: number) {
  if (!Number.isFinite(t) || t === 0) return "0"
  const a = Math.abs(t)
  if (a >= 1e-2 && a < 1e3) return t.toPrecision(3).replace(/\.?0+$/, "")
  return t.toExponential(1).replace("e-", "e\u2212")
}

const formatSteps = (n: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n)

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
  // x-axis: simulated time (smooth, near-linear growth) or KMC step count
  const [xMode, setXMode] = useState<"time" | "step">("time")

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
      <div className="flex items-center justify-center gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Atom counts over {xMode === "time" ? "time" : "steps"}
        </h3>
        <div
          role="radiogroup"
          aria-label="Chart x-axis"
          className="flex rounded-full border border-border p-0.5 text-xs"
        >
          {(
            [
              ["time", "Time"],
              ["step", "Steps"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={xMode === value}
              onClick={() => setXMode(value)}
              className={
                "rounded-full px-2.5 py-0.5 font-medium transition-colors " +
                (xMode === value
                  ? "bg-brand text-brand-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 w-full flex-1">
        {data.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full min-h-0 w-full"
          >
            <LineChart
              data={data}
              margin={{ top: 8, right: 12, left: -16, bottom: 14 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />

              <XAxis
                dataKey={xMode}
                type="number"
                domain={[0, "dataMax"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={xMode === "time" ? formatSimTime : formatSteps}
                label={{
                  value: xMode === "time" ? "Simulated time (s)" : "KMC step",
                  position: "insideBottomRight",
                  offset: -2,
                  className: "fill-muted-foreground text-[10px]",
                }}
              />

              <YAxis
                domain={[0, "auto"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | { time: number; step: number }
                        | undefined
                      return row
                        ? `t = ${formatSimTime(row.time)} s · step ${row.step.toLocaleString()}`
                        : ""
                    }}
                  />
                }
              />
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
