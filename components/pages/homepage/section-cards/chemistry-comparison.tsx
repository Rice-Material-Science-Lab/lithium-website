"use client"

import { cn } from "@/lib/utils"
import { useState, type ReactNode } from "react"
import { Panel } from "../layout-primitives"

type Risk = "Very high" | "Intermediate" | "Moderate" | "Very low"

const riskStyles: Record<Risk, string> = {
  "Very high":
    "border-destructive/40 bg-destructive/15 text-destructive dark:bg-destructive/20",
  Intermediate:
    "border-caution/40 bg-caution/15 text-caution dark:bg-caution/20",
  Moderate:
    "border-warning/40 bg-warning/15 text-warning dark:bg-warning/20",
  "Very low":
    "border-success/40 bg-success/15 text-success dark:bg-success/20",
}

type Anode = {
  material: string
  risk: Risk
  energy: { value: string; note: string }
  thermal: { value: string; note: string }
  cycles: { value: string; note: string }
  why: string
  usedIn: string
}

const anodes: Anode[] = [
  {
    material: "Lithium metal",
    risk: "Very high",
    energy: { value: "~350–500 Wh/kg", note: "Prototype cells; highest possible" },
    thermal: { value: "Low", note: "Very reactive, melts at ~180\u00a0°C" },
    cycles: { value: "~100–500", note: "Still in development" },
    why: "Nothing holds the lithium, so it plates bare metal onto bare metal every charge.",
    usedIn: "Next-generation and solid-state research cells",
  },
  {
    material: "Graphite",
    risk: "Intermediate",
    energy: { value: "~200–300 Wh/kg", note: "Today's standard" },
    thermal: { value: "Moderate", note: "Its protective surface film breaks down when overheated" },
    cycles: { value: "~1,000–3,000", note: "Depends on the cathode" },
    why: "Stores lithium very close to the voltage where lithium metal plates out.",
    usedIn: "Most phones, laptops, and EVs today",
  },
  {
    material: "Silicon",
    risk: "Moderate",
    energy: { value: "~300–400+ Wh/kg", note: "About 10× graphite's capacity" },
    thermal: { value: "Moderate", note: "Similar to graphite" },
    cycles: { value: "~500–1,000", note: "More silicon means fewer cycles" },
    why: "Swells up to ~3× as it charges; the cracking makes deposition uneven.",
    usedIn: "Blended into graphite in some newer phones and EVs",
  },
  {
    material: "Lithium titanate (LTO)",
    risk: "Very low",
    energy: { value: "~60–100 Wh/kg", note: "Lowest of the four" },
    thermal: { value: "Very high", note: "Highly resistant to thermal runaway" },
    cycles: { value: "~5,000–20,000+", note: "Barely changes size as it charges" },
    why: "Works at a voltage far above where lithium metal can form.",
    usedIn: "Electric buses, grid storage, very fast-charging systems",
  },
]

const rows: { label: string; render: (a: Anode) => ReactNode }[] = [
  {
    label: "Dendrite growth risk",
    render: (a) => (
      <span
        className={cn(
          "inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
          riskStyles[a.risk]
        )}
      >
        {a.risk}
      </span>
    ),
  },
  {
    label: "Typical energy density",
    render: (a) => <ValueCell {...a.energy} />,
  },
  {
    label: "Thermal stability",
    render: (a) => <ValueCell {...a.thermal} />,
  },
  {
    label: "Typical cycle life",
    render: (a) => <ValueCell {...a.cycles} />,
  },
  {
    label: "Why the dendrite risk",
    render: (a) => (
      <span className="text-xs leading-relaxed text-muted-foreground">{a.why}</span>
    ),
  },
  {
    label: "Where you'll find it",
    render: (a) => <span className="text-xs text-foreground/90">{a.usedIn}</span>,
  },
]

function ValueCell({ value, note }: { value: string; note: string }) {
  return (
    <div>
      <p className="text-foreground/90">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}

export default function ChemistryComparison() {
  const [focus, setFocus] = useState<string | null>(null)

  return (
    <Panel className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Highlight
        </span>
        {anodes.map((a) => {
          const selected = focus === a.material
          return (
            <button
              key={a.material}
              type="button"
              aria-pressed={selected}
              onClick={() => setFocus(selected ? null : a.material)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium transition-all",
                selected
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-background text-foreground/80 hover:border-primary/40 hover:text-foreground"
              )}
            >
              {a.material}
            </button>
          )
        })}
      </div>
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-160 border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="w-36 py-3 pr-4 font-semibold text-foreground/70">
                <span className="sr-only">Property</span>
              </th>
              {anodes.map((a) => (
                <th
                  key={a.material}
                  scope="col"
                  className={cn(
                    "rounded-t-xl px-3 py-3 font-semibold text-foreground transition-all duration-300",
                    focus === a.material && "bg-primary/8 dark:bg-brand/10",
                    focus && focus !== a.material && "opacity-40"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setFocus(focus === a.material ? null : a.material)}
                    className="text-left hover:underline hover:underline-offset-4"
                  >
                    {a.material}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label} className="border-b border-border/60 align-top last:border-0">
                <th scope="row" className="py-3 pr-4 text-left font-medium text-muted-foreground">
                  {row.label}
                </th>
                {anodes.map((a) => (
                  <td
                    key={a.material}
                    className={cn(
                      "px-3 py-3 transition-all duration-300",
                      focus === a.material && "bg-primary/8 dark:bg-brand/10",
                      focus === a.material && ri === rows.length - 1 && "rounded-b-xl",
                      focus && focus !== a.material && "opacity-40"
                    )}
                  >
                    {row.render(a)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Energy density is for a full cell, and all values are typical ranges.
        Real numbers depend on the cathode, cell design, and how the battery is
        used.
      </p>
    </Panel>
  )
}