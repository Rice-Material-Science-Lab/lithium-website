"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { useEffect, useId, useState } from "react"

const STEP_MS = 5000

const steps = [
  {
    title: "Ions cross the electrolyte",
    text: "During charging, lithium ions leave the cathode and travel through the electrolyte toward the anode.",
  },
  {
    title: "Deposition is uneven",
    text: "Instead of plating as a smooth film, ions settle unevenly, leaving microscopic high points on the anode surface.",
  },
  {
    title: "Electric field concentrates",
    text: "Those high points distort the local electric field, which pulls even more lithium toward the same spots.",
  },
  {
    title: "A filament grows",
    text: "Cycle after cycle, the spot builds outward into a branching, needle-like dendrite reaching toward the cathode.",
  },
  {
    title: "The separator fails",
    text: "Once a dendrite bridges the gap and punctures the separator, it creates a direct short circuit between electrodes.",
  },
]

/* ---------- drawing data (viewBox 0 0 520 300) ---------- */

const SURFACE_X = 70
const TIP_Y = 150
const ION = "#f59e0b"
const ION_STROKE = "#b45309"

// Uneven lithium layer on the anode surface; the big bump at y≈150 becomes the dendrite root.
const DEPOSIT =
  "M 70 20 L 76 20 C 84 38, 74 52, 82 68 C 88 82, 76 96, 82 112 C 90 128, 104 138, 104 150 C 104 162, 90 172, 82 188 C 76 204, 86 216, 80 232 C 75 248, 84 264, 76 280 L 70 280 Z"

const MAIN_A = "M 102 150 C 120 146, 150 158, 180 150 S 230 140, 262 150"
const BRANCHES_A = [
  "M 130 151 L 148 130 L 162 120",
  "M 168 152 L 186 172 L 198 184",
  "M 214 146 L 230 125",
  "M 238 147 L 254 168",
]
const MAIN_B = "M 262 150 C 290 156, 316 146, 336 150 S 400 154, 450 150"
const BRANCHES_B = ["M 292 153 L 306 134", "M 380 152 L 398 172", "M 420 150 L 436 132"]

// Curved field lines that converge on the tip of the bump.
const FIELD_LINES = [
  "M 440 50 C 330 60, 180 110, 108 146",
  "M 440 110 C 320 120, 180 140, 108 148",
  "M 440 190 C 320 180, 180 160, 108 152",
  "M 440 250 C 330 240, 180 190, 108 154",
]

function Ion({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={ION} stroke={ION_STROKE} strokeWidth={1} />
      <path
        d={`M ${x - r * 0.45} ${y} H ${x + r * 0.45} M ${x} ${y - r * 0.45} V ${y + r * 0.45}`}
        stroke="white"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
    </g>
  )
}

function MovingIon({
  from,
  to,
  delay,
  reduced,
}: {
  from: [number, number]
  to: [number, number]
  delay: number
  reduced: boolean
}) {
  if (reduced) {
    const mid: [number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
    return <Ion x={mid[0]} y={mid[1]} />
  }
  return (
    <motion.g
      initial={{ x: from[0], y: from[1], opacity: 0 }}
      animate={{
        x: [from[0], to[0]],
        y: [from[1], to[1]],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 2.6,
        delay,
        repeat: Infinity,
        ease: "easeIn",
        opacity: { duration: 2.6, delay, repeat: Infinity, times: [0, 0.15, 0.85, 1] },
      }}
    >
      <Ion x={0} y={0} />
    </motion.g>
  )
}

function FormationDiagram({ step, reduced }: { step: number; reduced: boolean }) {
  const uid = useId().replace(/:/g, "")
  const poreId = `pore-${uid}`
  const heatId = `heat-${uid}`

  const showDeposit = step >= 1
  const showField = step === 2
  const showDendriteA = step >= 3
  const shorted = step >= 4

  // Where arriving ions land changes as the story progresses.
  const ionLanes = [50, 95, 140, 185, 230, 262]
  const ionTargets: [number, number][] = ionLanes.map((y) => {
    if (step <= 1) return [SURFACE_X + 10, y]
    if (step === 2) return [110, TIP_Y + (y - TIP_Y) * 0.08]
    return [262, TIP_Y + (y - TIP_Y) * 0.05]
  })

  const draw = (delay = 0) =>
    reduced
      ? { initial: false as const, animate: { pathLength: 1, opacity: 1 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <svg
      viewBox="0 0 520 300"
      className="h-auto w-full"
      role="img"
      aria-label={`Step ${step + 1}: ${steps[step].title}. ${steps[step].text}`}
    >
      <defs>
        <pattern id={poreId} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.2" className="fill-foreground/35" />
        </pattern>
        <radialGradient id={heatId}>
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* electrolyte */}
      <rect x="0" y="10" width="520" height="280" rx="14" className="fill-sky-500/10" />

      {/* anode + cathode */}
      <rect x="10" y="20" width={SURFACE_X - 10} height="260" rx="6" className="fill-foreground/15" />
      {[45, 85, 125, 165, 205, 245].map((y) => (
        <line key={y} x1="18" x2={SURFACE_X - 6} y1={y} y2={y} className="stroke-foreground/30" strokeWidth={2} />
      ))}
      <rect x="450" y="20" width="60" height="260" rx="6" className="fill-indigo-500/25" />
      {[45, 85, 125, 165, 205, 245].map((y) => (
        <line key={y} x1="456" x2="504" y1={y} y2={y} className="stroke-indigo-500/60 dark:stroke-indigo-300/60" strokeWidth={3} strokeDasharray="2 5" strokeLinecap="round" />
      ))}

      {/* separator */}
      <rect x="330" y="14" width="12" height="272" fill={`url(#${poreId})`} />
      <rect x="330" y="14" width="12" height="272" fill="none" className="stroke-foreground/35" strokeDasharray="4 4" />

      {/* field lines */}
      <AnimatePresence>
        {showField &&
          FIELD_LINES.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              className="stroke-cyan-500 dark:stroke-cyan-300"
              strokeWidth={1.5}
              strokeDasharray="5 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: i * 0.08 }}
            />
          ))}
      </AnimatePresence>

      {/* uneven deposit */}
      <AnimatePresence>
        {showDeposit && (
          <motion.path
            d={DEPOSIT}
            className="fill-slate-300 stroke-slate-400 dark:fill-slate-400 dark:stroke-slate-300"
            strokeWidth={1}
            initial={reduced ? false : { opacity: 0, scaleX: 0.2 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0 }}
            style={{ originX: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* dendrite */}
      {showDendriteA && (
        <g
          className="stroke-slate-400 dark:stroke-slate-200"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path key={`a-${step}`} d={MAIN_A} strokeWidth={4} {...draw()} />
          {BRANCHES_A.map((d, i) => (
            <motion.path key={`${d}-${step}`} d={d} strokeWidth={2.5} {...draw(0.4 + i * 0.12)} />
          ))}
          {shorted && (
            <>
              <motion.path key="b" d={MAIN_B} strokeWidth={4} {...draw(0.3)} />
              {BRANCHES_B.map((d, i) => (
                <motion.path key={d} d={d} strokeWidth={2.5} {...draw(0.9 + i * 0.12)} />
              ))}
            </>
          )}
        </g>
      )}

      {/* short circuit */}
      {shorted && (
        <g>
          <motion.circle
            cx="336"
            cy={TIP_Y}
            r="60"
            fill={`url(#${heatId})`}
            initial={{ opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: [0.5, 1, 0.5] }}
            transition={reduced ? {} : { duration: 1.2, repeat: Infinity, delay: 1.4 }}
          />
          <motion.circle
            cx="450"
            cy={TIP_Y}
            r="40"
            fill={`url(#${heatId})`}
            initial={{ opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: [0.4, 1, 0.4] }}
            transition={reduced ? {} : { duration: 0.9, repeat: Infinity, delay: 1.6 }}
          />
          <motion.g
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 1.5 }}
          >
            <rect x="352" y="96" width="92" height="24" rx="12" className="fill-destructive" />
            <text x="398" y="112" textAnchor="middle" fontSize="11" fontWeight={700} fill="white" letterSpacing="0.08em">
              SHORT CIRCUIT
            </text>
          </motion.g>
        </g>
      )}

      {/* travelling ions */}
      {step < 4 &&
        ionLanes.map((y, i) => (
          <MovingIon
            key={`${step}-${i}`}
            from={[430, y]}
            to={ionTargets[i]}
            delay={i * 0.42}
            reduced={reduced}
          />
        ))}

      {/* labels */}
      <g fontSize="11" fontWeight={600} className="fill-muted-foreground" textAnchor="middle">
        <text x="40" y="298">ANODE</text>
        <text x="336" y="298">SEPARATOR</text>
        <text x="480" y="298">CATHODE</text>
      </g>
    </svg>
  )
}

export default function DendriteFormation() {
  const reducedPref = useReducedMotion()
  const reduced = !!reducedPref
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => {
      setStep((s) => (s + 1) % steps.length)
    }, STEP_MS)
    return () => clearTimeout(t)
  }, [playing, step])

  function go(i: number) {
    setPlaying(false)
    setStep((i + steps.length) % steps.length)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
      <ol className="space-y-1.5" aria-label="Stages of dendrite formation">
        {steps.map((s, i) => {
          const isActive = i === step
          return (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary/5 dark:border-cyan-500/40 dark:bg-cyan-500/5"
                    : "border-transparent hover:bg-muted/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors",
                      isActive || i < step
                        ? "bg-primary text-primary-foreground dark:bg-cyan-600"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isActive ? "text-foreground" : "text-foreground/70"
                    )}
                  >
                    {s.title}
                  </span>
                </div>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pl-10 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="block pt-1.5">{s.text}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
                {isActive && playing && !reduced && (
                  <motion.span
                    key={`bar-${step}`}
                    aria-hidden
                    className="absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-cyan-400"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-border bg-muted/30 p-3 sm:p-5">
          <FormationDiagram step={step} reduced={reduced} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Stage {step + 1} of {steps.length} · not to scale
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(step - 1)}
              aria-label="Previous stage"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 dark:bg-cyan-600"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => go(step + 1)}
              aria-label="Next stage"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}