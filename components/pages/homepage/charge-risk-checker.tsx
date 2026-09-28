"use client"

import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useState } from "react"

type Option<T extends string> = { id: T; label: string; points: number; advice?: string }

type Temp = "freezing" | "cool" | "room" | "hot"
type Speed = "slow" | "standard" | "fast"
type Level = "80" | "100"

const temps: Option<Temp>[] = [
  {
    id: "freezing",
    label: "Below 0 °C",
    points: 45,
    advice: "Let the device warm up to room temperature before plugging it in.",
  },
  { id: "cool", label: "0–10 °C", points: 15, advice: "Cool batteries take lithium in slowly, so ease off fast charging." },
  { id: "room", label: "Room temp", points: 0 },
  { id: "hot", label: "Above 35 °C", points: 20, advice: "Move it out of the sun or off hot surfaces while it charges." },
]

const speeds: Option<Speed>[] = [
  { id: "slow", label: "Slow", points: 0 },
  { id: "standard", label: "Standard", points: 8 },
  {
    id: "fast",
    label: "Fast charge",
    points: 28,
    advice: "Save fast charging for when you need it. A standard charger is gentler day to day.",
  },
]

const levels: Option<Level>[] = [
  { id: "80", label: "Stop around 80%", points: 0 },
  {
    id: "100",
    label: "100% and left plugged in",
    points: 15,
    advice: "Turn on Optimized / Adaptive Charging so the phone holds at 80% until you need it.",
  },
]

function band(score: number) {
  if (score < 20) return { label: "Low", color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" }
  if (score < 45) return { label: "Moderate", color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" }
  if (score < 70) return { label: "Elevated", color: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" }
  return { label: "High", color: "bg-red-500", text: "text-red-600 dark:text-red-400" }
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const selected = o.id === value
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(o.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                selected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm dark:border-cyan-600 dark:bg-cyan-600"
                  : "border-border bg-background text-foreground/80 hover:border-primary/40 hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function ChargeRiskChecker() {
  const [temp, setTemp] = useState<Temp>("room")
  const [speed, setSpeed] = useState<Speed>("fast")
  const [level, setLevel] = useState<Level>("100")

  const t = temps.find((o) => o.id === temp)!
  const s = speeds.find((o) => o.id === speed)!
  const l = levels.find((o) => o.id === level)!

  const combo = (temp === "freezing" || temp === "cool") && speed === "fast" ? 15 : 0
  const score = Math.min(100, 5 + t.points + s.points + l.points + combo)
  const b = band(score)
  const advice = [t.advice, s.advice, l.advice].filter(Boolean) as string[]

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-5">
        <Segmented label="Temperature" options={temps} value={temp} onChange={setTemp} />
        <Segmented label="Charging speed" options={speeds} value={speed} onChange={setSpeed} />
        <Segmented label="Charge to" options={levels} value={level} onChange={setLevel} />
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-border bg-muted/30 p-5">
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Plating risk
            </p>
            <motion.p
              key={b.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("text-2xl font-bold", b.text)}
            >
              {b.label}
            </motion.p>
          </div>
          <div
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-foreground/10"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
            aria-valuetext={b.label}
            aria-label="Lithium plating risk"
          >
            <motion.div
              className={cn("h-full rounded-full", b.color)}
              animate={{ width: `${score}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="mt-4 min-h-24">
            {advice.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                This is the ideal setup: room temperature, gentle current, and
                no long stretches at 100%. Lithium has time to slide neatly into
                the graphite.
              </p>
            ) : (
              <ul className="space-y-2">
                {advice.map((a) => (
                  <motion.li
                    key={a}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2 text-sm leading-relaxed text-foreground/85"
                  >
                    <span aria-hidden className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", b.color)} />
                    {a}
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          An illustration of which conditions matter, not a lab measurement.
        </p>
      </div>
    </div>
  )
}