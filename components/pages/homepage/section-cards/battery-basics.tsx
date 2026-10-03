"use client"

import { cn } from "@/lib/utils"
import { useEffect, useId, useState } from "react"
import { ArrowDown, BatteryCharging, Lightbulb } from "lucide-react"

type Mode = "discharge" | "charge"

/* ---------- geometry for the schematic (viewBox 800 x 430) ---------- */

const LAYER_YS = [132, 167, 202, 237, 272, 307, 342] // host layers (graphite / oxide)
const LANE_YS = LAYER_YS.slice(0, -1).map((y) => y + 17.5) // gaps where Li+ lives
const ANODE_X = [104, 300]
const CATHODE_X = [500, 696]
const WIRE_DISCHARGE = "M 94 118 V 48 H 706 V 118" // anode -> device -> cathode
const WIRE_CHARGE = "M 706 118 V 48 H 94 V 118" // cathode -> charger -> anode

const COPPER = "var(--diagram-copper)"
const ALUMINUM = "var(--diagram-aluminum)"
const ION = "var(--diagram-ion)"
const ION_STROKE = "var(--diagram-ion-stroke)"
const ELECTRON = "var(--diagram-electron)"

function zigzag(y: number, x0: number, x1: number, step = 12, amp = 4) {
  let d = `M ${x0} ${y}`
  let up = true
  for (let x = x0 + step / 2; x <= x1; x += step / 2) {
    d += ` L ${x} ${y + (up ? -amp : amp)}`
    up = !up
  }
  return d
}

function ionPath(y: number, mode: Mode) {
  const a = { x: 268, y }
  const b = { x: 560, y }
  const [from, to] = mode === "discharge" ? [a, b] : [b, a]
  const bend = mode === "discharge" ? 14 : -14
  return `M ${from.x} ${from.y} C ${from.x + (to.x - from.x) * 0.25} ${from.y - bend}, ${
    from.x + (to.x - from.x) * 0.75
  } ${to.y + bend}, ${to.x} ${to.y}`
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return reduced
}

function Ion({ cx, cy, r = 7, opacity = 1 }: { cx?: number; cy?: number; r?: number; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <circle cx={cx} cy={cy} r={r} fill={ION} stroke={ION_STROKE} strokeWidth={1.2} />
      <path
        d={`M ${(cx ?? 0) - r * 0.45} ${cy ?? 0} H ${(cx ?? 0) + r * 0.45} M ${cx ?? 0} ${(cy ?? 0) - r * 0.45} V ${(cy ?? 0) + r * 0.45}`}
        stroke="white"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </g>
  )
}

function BatterySchematic({ mode, reduced }: { mode: Mode; reduced: boolean }) {
  const uid = useId().replace(/:/g, "")
  const glowId = `glow-${uid}`
  const poreId = `pores-${uid}`
  const clipId = `clip-${uid}`

  const discharging = mode === "discharge"
  const wire = discharging ? WIRE_DISCHARGE : WIRE_CHARGE
  const ionDur = 4.2
  const eDur = 5

  // Where lithium is "parked" right now: it accumulates in the destination electrode
  const restingSide = discharging ? CATHODE_X : ANODE_X
  const sparseSide = discharging ? ANODE_X : CATHODE_X

  return (
    <svg
      viewBox="0 0 800 430"
      className="h-auto w-full min-w-130"
      role="img"
      aria-label={
        discharging
          ? "Battery discharging: lithium ions travel from the graphite anode through the electrolyte and separator into the metal-oxide cathode, while electrons flow through the external circuit to power a device."
          : "Battery charging: the charger drives electrons back to the anode, pulling lithium ions out of the cathode, across the separator, and back between the graphite layers of the anode."
      }
    >
      <defs>
        <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <pattern id={poreId} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.6" className="fill-foreground/35" />
        </pattern>
        <clipPath id={clipId}>
          <rect x="70" y="100" width="660" height="280" rx="18" />
        </clipPath>
      </defs>

      {/* ---------- external circuit ---------- */}
      <path d={WIRE_DISCHARGE} fill="none" className="stroke-foreground/40" strokeWidth={3} strokeLinejoin="round" />

      {/* electrons */}
      {Array.from({ length: 9 }).map((_, i) =>
        reduced ? null : (
          <circle key={`${mode}-e-${i}`} r={4.5} fill={ELECTRON}>
            <animateMotion dur={`${eDur}s`} repeatCount="indefinite" begin={`-${(i * eDur) / 9}s`} path={wire} />
          </circle>
        )
      )}
      <text x={discharging ? 200 : 600} y={36} textAnchor="middle" fontSize="13" fontWeight={700} fill={ELECTRON}>
        e⁻ {discharging ? "→" : "←"}
      </text>

      {/* device / charger */}
      <g>
        <rect x={330} y={26} width={140} height={44} rx={12} className="fill-card stroke-border" strokeWidth={1.5} />
        {discharging ? (
          <g>
            {!reduced && (
              <circle cx={356} cy={46} r={12} fill={ION} filter={`url(#${glowId})`}>
                <animate attributeName="opacity" values="0.35;0.9;0.35" dur="2.4s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={356} cy={45} r={8} fill={ION} />
            <rect x={352} y={52} width={8} height={6} rx={1.5} className="fill-foreground/50" />
          </g>
        ) : (
          <path d="M 359 32 L 349 49 H 357 L 353 62 L 365 43 H 357 Z" fill={ELECTRON} />
        )}
        <text x={376} y={52} fontSize="14" fontWeight={600} className="fill-foreground">
          {discharging ? "Your device" : "Charger"}
        </text>
      </g>

      {/* ---------- cell casing & electrolyte ---------- */}
      <rect x="70" y="100" width="660" height="280" rx="18" className="fill-brand/10 stroke-border" strokeWidth={2} />

      <g clipPath={`url(#${clipId})`}>
        {/* current collectors */}
        <rect x="88" y="100" width="12" height="280" fill={COPPER} />
        <rect x="700" y="100" width="12" height="280" fill={ALUMINUM} />
      </g>
      <rect x="88" y="100" width="12" height="20" fill={COPPER} />
      <rect x="700" y="100" width="12" height="20" fill={ALUMINUM} />

      {/* anode: stacked graphene sheets */}
      <rect x={ANODE_X[0]} y="118" width={ANODE_X[1] - ANODE_X[0]} height="244" rx="6" className="fill-foreground/5" />
      {LAYER_YS.map((y) => (
        <path
          key={`g-${y}`}
          d={zigzag(y, ANODE_X[0] + 6, ANODE_X[1] - 6)}
          fill="none"
          className="stroke-foreground/60"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      ))}

      {/* cathode: layered metal oxide */}
      <rect x={CATHODE_X[0]} y="118" width={CATHODE_X[1] - CATHODE_X[0]} height="244" rx="6" className="fill-diagram-cathode/10" />
      {LAYER_YS.map((y) => (
        <g key={`c-${y}`}>
          <rect x={CATHODE_X[0] + 6} y={y - 3} width={CATHODE_X[1] - CATHODE_X[0] - 12} height={6} rx={3} className="fill-diagram-cathode/40" />
          {Array.from({ length: 13 }).map((_, k) => (
            <circle key={k} cx={CATHODE_X[0] + 14 + k * 14} cy={y} r={3.6} className="fill-diagram-cathode" />
          ))}
        </g>
      ))}

      {/* separator */}
      <rect x="390" y="104" width="20" height="272" fill={`url(#${poreId})`} />
      <rect x="390" y="104" width="20" height="272" fill="none" className="stroke-foreground/40" strokeDasharray="4 4" />

      {/* resting lithium between layers */}
      {LANE_YS.map((y, i) =>
        [0.18, 0.42, 0.66, 0.88].map((t, k) => (
          <Ion
            key={`rest-${i}-${k}`}
            cx={restingSide[0] + (restingSide[1] - restingSide[0]) * t + (i % 2 ? 8 : -8)}
            cy={y}
            r={5}
            opacity={0.9}
          />
        ))
      )}
      {LANE_YS.map((y, i) =>
        i % 2 === 0 ? (
          <Ion key={`sparse-${i}`} cx={sparseSide[0] + (sparseSide[1] - sparseSide[0]) * 0.5} cy={y} r={5} opacity={0.45} />
        ) : null
      )}

      {/* travelling Li+ ions */}
      {LANE_YS.map((y, i) =>
        [0, 0.5].map((phase) => {
          const d = ionPath(y, mode)
          const begin = -((i * 0.37 + phase) * ionDur) % ionDur
          if (reduced) {
            return phase === 0 ? <Ion key={`static-${i}`} cx={350 + (i % 3) * 50} cy={y} /> : null
          }
          return (
            <g key={`${mode}-ion-${i}-${phase}`}>
              <Ion cx={0} cy={0} />
              <animateMotion dur={`${ionDur}s`} repeatCount="indefinite" begin={`${begin}s`} path={d} />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.88;1"
                dur={`${ionDur}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
              />
            </g>
          )
        })
      )}

      <text x={450} y={370} textAnchor="middle" fontSize="12" fontStyle="italic" className="fill-brand">
        electrolyte
      </text>
      <text x={350} y={370} textAnchor="middle" fontSize="12" fontStyle="italic" className="fill-brand">
        electrolyte
      </text>

      {/* ---------- labels ---------- */}
      <g fontSize="14" fontWeight={700} textAnchor="middle">
        <text x={202} y={404} className="fill-foreground">
          Anode (−)
        </text>
        <text x={400} y={404} className="fill-foreground">
          Separator
        </text>
        <text x={598} y={404} className="fill-foreground">
          Cathode (+)
        </text>
      </g>
      <g fontSize="12" textAnchor="middle" className="fill-muted-foreground">
        <text x={202} y={421}>graphite on copper foil</text>
        <text x={400} y={421}>porous polymer film</text>
        <text x={598} y={421}>metal oxide on aluminum foil</text>
      </g>
    </svg>
  )
}

const parts = [
  {
    name: "Anode (−)",
    swatch: "bg-foreground/60",
    text: "Usually graphite: stacked sheets of carbon. Lithium tucks in between the sheets when the battery is charged.",
  },
  {
    name: "Cathode (+)",
    swatch: "bg-diagram-cathode",
    text: "A lithium metal oxide such as NMC or LFP. It takes lithium back in as the battery powers your device.",
  },
  {
    name: "Electrolyte",
    swatch: "bg-brand",
    text: "A lithium salt dissolved in liquid solvent. Ions can travel through it but electrons can't, and in most cells it's flammable.",
  },
  {
    name: "Separator",
    swatch: "bg-foreground/30",
    text: "A porous plastic film thinner than a human hair. Ions pass through it, but it keeps the two electrodes from touching.",
  },
]

const modeCopy: Record<Mode, { title: string; body: string }> = {
  discharge: {
    title: "Discharging: powering your device",
    body: "Lithium ions leave the graphite, cross the electrolyte and separator, and settle into the cathode. Electrons can't take that route, so they travel through the outside circuit instead. That flow of electrons is the current that runs your phone, laptop, or e-bike.",
  },
  charge: {
    title: "Charging: refilling the battery",
    body: "The charger pushes electrons back toward the anode, and lithium ions follow them across the separator into the gaps between the graphite sheets. This is when dendrites can start. If ions arrive faster than the graphite can take them in (fast charging, cold weather, an aging cell), they pile up on the surface as lithium metal.",
  },
}

export default function BatteryBasics() {
  const [mode, setMode] = useState<Mode>("discharge")
  const reduced = usePrefersReducedMotion()

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-16px_rgb(0_0_0/0.18)] dark:shadow-none">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Battery state"
            className="inline-flex w-full rounded-full bg-background p-1 shadow-inner sm:w-auto"
          >
            {(
              [
                { id: "discharge", label: "Discharging", Icon: Lightbulb },
                { id: "charge", label: "Charging", Icon: BatteryCharging },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={mode === id}
                onClick={() => setMode(id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors sm:flex-none",
                  mode === id
                    ? "bg-brand text-brand-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full border border-warning bg-warning" /> Lithium ion (Li⁺)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand" /> Electron (e⁻)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto px-2 pt-4 pb-2 sm:px-6">
          <BatterySchematic mode={mode} reduced={reduced} />
        </div>

        <div className="border-t border-border px-4 py-4 sm:px-6" aria-live="polite">
          <p className="text-sm font-semibold text-foreground/90">{modeCopy[mode].title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{modeCopy[mode].body}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {parts.map((p) => (
          <div key={p.name} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full", p.swatch)} />
              <p className="text-sm font-semibold text-foreground/90">{p.name}</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/15 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/50">
          <ArrowDown className="h-4 w-4 text-destructive" />
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">
          <span className="font-semibold">Where things go wrong:</span> in a healthy cell, lithium slips neatly between
          the graphite sheets every time it charges. When it doesn&apos;t, it builds up on the anode&apos;s surface
          instead, and that buildup is how dendrites begin.
        </p>
      </div>
    </div>
  )
}