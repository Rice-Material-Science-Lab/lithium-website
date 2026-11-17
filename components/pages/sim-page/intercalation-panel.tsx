"use client"

import { useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

// Shape of get_intercalation_json() (lithium-kmc "Stage 5", PR #78). All
// per-column arrays are parallel to gap_columns.
export type IntercalationStats = {
  gap_columns: number[]
  capacities: number[]
  counts: number[]
  intercalated: number[]
  plating: number[]
  intercalated_total: number
  plating_total: number
  saturated_columns: number[]
}

// Minimal structural slice of the WASM module this reader needs. The two
// functions are optional: builds older than PR #78 don't export them, and a
// browser can still be holding one of those in its cache.
type IntercalationModule = {
  _get_intercalation_json?: () => number
  _get_intercalation_json_len?: () => number
}

export function supportsIntercalation(mod: unknown): boolean {
  const m = mod as IntercalationModule | null
  return (
    typeof m?._get_intercalation_json === "function" &&
    typeof m?._get_intercalation_json_len === "function"
  )
}

const isIntArray = (v: unknown): v is number[] =>
  Array.isArray(v) && v.every((n) => Number.isInteger(n))

function isIntercalationStats(v: unknown): v is IntercalationStats {
  if (typeof v !== "object" || v === null) return false
  const s = v as Record<string, unknown>
  const cols = s.gap_columns
  if (!isIntArray(cols)) return false
  const parallel = ["capacities", "counts", "intercalated", "plating"] as const
  return (
    parallel.every((k) => isIntArray(s[k]) && s[k].length === cols.length) &&
    isIntArray(s.saturated_columns) &&
    Number.isInteger(s.intercalated_total) &&
    Number.isInteger(s.plating_total)
  )
}

// Reads and validates the intercalation JSON. Returns null for an old build,
// an uninitialized simulation, or a malformed frame.
// - Pointer and length are each read exactly once: every call to
//   _get_intercalation_json() rebuilds the C++ string and may move it, so a
//   second call would invalidate the first pointer.
// - The memory buffer is fetched AFTER those calls: building the string can
//   grow the WASM heap (ALLOW_MEMORY_GROWTH), which detaches any
//   ArrayBuffer obtained before it.
export function readIntercalationStats(
  mod: unknown,
  getBuffer: () => ArrayBuffer | null
): IntercalationStats | null {
  if (!supportsIntercalation(mod)) return null
  const m = mod as Required<IntercalationModule>
  try {
    const ptr = m._get_intercalation_json()
    const len = m._get_intercalation_json_len()
    const buffer = getBuffer()
    if (!buffer || !ptr || len <= 0 || ptr + len > buffer.byteLength)
      return null
    const text = new TextDecoder("utf-8").decode(
      new Uint8Array(buffer, ptr, len)
    )
    const parsed: unknown = JSON.parse(text)
    return isIntercalationStats(parsed) ? parsed : null
  } catch (e) {
    console.warn("Skipped malformed intercalation frame from WASM memory:", e)
    return null
  }
}

// Lattice codes (lkmc-wasm.cpp). Stage 5 adds no new codes.
const FREE = 1
const DEPOSITED = 2
const PASSIVATED = 4
const CARBON = 5

export type IntercalationTotals = {
  gaps: number
  intercalated: number
  plating: number
}

// The Stage 5 totals computed in JS from a lattice the page already holds,
// in one O(nx*ny) pass. Same rules as get_intercalation_json in
// lithium-kmc dfe1964 (periodic x, capacity = rows where a neighbouring
// column holds carbon; no fixed-capacity override, which the site can't
// set). Used for the cheap per-frame history; the WASM stays the source of
// truth for the table, and the page cross-checks the two whenever it reads
// the WASM.
export function intercalationTotals(
  lattice: ArrayLike<number>,
  nx: number,
  ny: number
): IntercalationTotals {
  const out = { gaps: 0, intercalated: 0, plating: 0 }
  if (nx <= 0 || ny <= 0 || lattice.length < nx * ny) return out
  const carbonCol = new Uint8Array(nx)
  let anyCarbon = false
  for (let y = 1; y < ny; y++)
    for (let x = 0; x < nx; x++)
      if (lattice[y * nx + x] === CARBON) {
        carbonCol[x] = 1
        anyCarbon = true
      }
  if (!anyCarbon) return out
  for (let x = 0; x < nx; x++) {
    if (carbonCol[x]) continue
    const l = (x - 1 + nx) % nx
    const r = (x + 1) % nx
    if (!carbonCol[l] && !carbonCol[r]) continue
    let cap = 0
    let atoms = 0
    for (let y = 0; y < ny; y++) {
      if (
        y >= 1 &&
        ((carbonCol[l] && lattice[y * nx + l] === CARBON) ||
          (carbonCol[r] && lattice[y * nx + r] === CARBON))
      )
        cap++
      const v = lattice[y * nx + x]
      if (v === FREE || v === DEPOSITED || v === PASSIVATED) atoms++
    }
    out.gaps++
    out.intercalated += Math.min(atoms, cap)
    out.plating += Math.max(0, atoms - cap)
  }
  return out
}

export type IntercalationHistoryPoint = {
  step: number
  time: number
  intercalated: number
  plating: number
}

// Keep at most `max` points: when full, drop every other point (keeps the
// whole run's shape at half the resolution) before appending.
export function appendHistory(
  history: IntercalationHistoryPoint[],
  point: IntercalationHistoryPoint,
  max = 2000
): IntercalationHistoryPoint[] {
  const last = history[history.length - 1]
  if (last && last.step === point.step) return history
  const base =
    history.length >= max ? history.filter((_, i) => i % 2 === 0) : history
  return [...base, point]
}

const formatSteps = (n: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)

function HistoryChart({ data }: { data: IntercalationHistoryPoint[] }) {
  const config = {
    intercalated: { label: "Intercalated", color: "var(--brand)" },
    plating: { label: "Plating", color: "var(--lattice-deposited)" },
  } satisfies ChartConfig
  if (data.length < 2)
    return (
      <div className="flex h-full min-h-24 items-center justify-center text-sm text-muted-foreground">
        Collecting data&hellip; keep the simulation running.
      </div>
    )
  return (
    <ChartContainer
      config={config}
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
          dataKey="step"
          type="number"
          domain={[0, "dataMax"]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatSteps}
          label={{
            value: "KMC step",
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
          allowDecimals={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                const row = payload?.[0]?.payload as
                  IntercalationHistoryPoint | undefined
                return row ? `step ${row.step.toLocaleString()}` : ""
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="intercalated"
          stroke="var(--color-intercalated)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="plating"
          stroke="var(--color-plating)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-w-24 flex-col rounded-xl border border-border px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold tabular-nums">
        {value.toLocaleString()}
      </span>
    </div>
  )
}

export default function IntercalationPanel({
  stats,
  supported,
  hasRun,
  slow,
  onRefresh,
  history,
  onExportHistory,
}: {
  stats: IntercalationStats | null
  supported: boolean
  hasRun: boolean
  // True when one read took long enough that auto-refresh was throttled
  // hard (large grid); the panel then says so next to Refresh.
  slow: boolean
  onRefresh: () => void
  history: IntercalationHistoryPoint[]
  onExportHistory: () => void
}) {
  const [view, setView] = useState<"columns" | "history">("columns")
  const message = !supported
    ? "This simulator build doesn't report intercalation. Reload the page to load the latest build."
    : !hasRun || !stats
      ? "No data yet. Run the simulation to see intercalation."
      : stats.gap_columns.length === 0
        ? "No gap columns. Intercalation is counted in empty lattice columns directly beside a carbon column, so carbon must stand in vertical columns: add a Graphite Lattice at 90°, or draw columns with Draw Carbon. The 60°/30° lattices (height 4 or more) touch every column and leave no gaps."
        : null

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <p className="max-w-prose text-xs text-muted-foreground">
          Li atoms in each gap column beside the carbon anode, up to that
          column&apos;s capacity (the height of the neighbouring carbon), count
          as intercalated. Anything above capacity is plating.
        </p>
        <div className="flex items-center gap-2">
          {slow && (
            <span className="text-xs text-muted-foreground">
              Large grid: updates slowly
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full"
            onClick={onRefresh}
            disabled={!supported || !hasRun}
          >
            Refresh
          </Button>
        </div>
      </div>

      {message || !stats ? (
        <div className="flex min-h-24 flex-1 items-center justify-center px-4 text-center text-sm text-muted-foreground">
          {message}
        </div>
      ) : (
        <>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Stat label="Intercalated" value={stats.intercalated_total} />
            <Stat label="Plating" value={stats.plating_total} />
            <Stat label="Gap columns" value={stats.gap_columns.length} />
            <Stat label="Saturated" value={stats.saturated_columns.length} />
            <div className="ml-auto flex items-center gap-2 self-end">
              <div
                role="radiogroup"
                aria-label="Intercalation view"
                className="flex rounded-full border border-border p-0.5 text-xs"
              >
                {(
                  [
                    ["columns", "Columns"],
                    ["history", "Over time"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={view === value}
                    onClick={() => setView(value)}
                    className={
                      "rounded-full px-2.5 py-2 font-medium transition-colors " +
                      (view === value
                        ? "bg-brand text-brand-foreground"
                        : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-full"
                onClick={onExportHistory}
                disabled={history.length === 0}
              >
                Export CSV
              </Button>
            </div>
          </div>
          {view === "history" ? (
            <div className="min-h-40 flex-1">
              <HistoryChart data={history} />
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-primary/30">
                  <tr>
                    <th className="p-1 text-left">Column x</th>
                    <th className="p-1 text-left">Capacity</th>
                    <th className="p-1 text-left">Li atoms</th>
                    <th className="p-1 text-left">Intercalated</th>
                    <th className="p-1 text-left">Plating</th>
                    <th className="w-1/4 p-1 text-left">Fill</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.gap_columns.map((x, i) => {
                    const cap = stats.capacities[i]
                    const pct =
                      cap > 0 ? Math.min(100, (stats.counts[i] / cap) * 100) : 0
                    const plating = stats.plating[i] > 0
                    return (
                      <tr
                        key={x}
                        className="border-t border-border hover:bg-primary/5 dark:border-border dark:hover:bg-primary/5"
                      >
                        <td className="p-1 tabular-nums">{x}</td>
                        <td className="p-1 tabular-nums">{cap}</td>
                        <td className="p-1 tabular-nums">{stats.counts[i]}</td>
                        <td className="p-1 tabular-nums">
                          {stats.intercalated[i]}
                        </td>
                        <td
                          className={cn(
                            "p-1 tabular-nums",
                            // Emphasis only: orange text fails AA contrast on
                            // the light theme; the bar carries the colour.
                            plating && "font-semibold"
                          )}
                        >
                          {stats.plating[i]}
                        </td>
                        <td className="p-1">
                          <div
                            className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10"
                            role="meter"
                            aria-label={`Column ${x} fill`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(pct)}
                          >
                            <div
                              className={cn(
                                "h-full rounded-full",
                                // Plating reuses the lattice's "Deposited" colour.
                                plating ? "bg-lattice-deposited" : "bg-brand"
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
