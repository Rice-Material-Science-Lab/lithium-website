"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  Bike,
  Car,
  Laptop,
  MonitorSmartphone,
  RotateCcw,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { useState, type ReactNode } from "react"
import { SavePdfButton } from "@/components/ui/save-pdf-button"

/* ---------------------------------- data ---------------------------------- */

type DeviceId = "iphone" | "android" | "mac" | "windows" | "ebike" | "ev"
type AgeId = "new" | "1-2" | "2-4" | "4+"
type HabitId = "full" | "empty" | "fast" | "heat" | "heavy" | "cold" | "charger"

const DEVICES: { id: DeviceId; label: string; icon: LucideIcon }[] = [
  { id: "iphone", label: "iPhone", icon: Smartphone },
  { id: "android", label: "Android phone", icon: MonitorSmartphone },
  { id: "mac", label: "MacBook", icon: Laptop },
  { id: "windows", label: "Windows laptop", icon: Laptop },
  { id: "ebike", label: "E-bike or scooter", icon: Bike },
  { id: "ev", label: "Electric vehicle", icon: Car },
]

const AGES: { id: AgeId; label: string }[] = [
  { id: "new", label: "Under 1 year" },
  { id: "1-2", label: "1–2 years" },
  { id: "2-4", label: "2–4 years" },
  { id: "4+", label: "4+ years" },
]

const AGE_NOTE: Record<AgeId, string> = {
  new: "Your battery is still new, so the habits you build now will matter most over its life.",
  "1-2": "Most batteries still hold close to their original charge at this age.",
  "2-4": "Some capacity loss is normal by now. The health check below will show you how much.",
  "4+": "A noticeable drop in capacity is common at this age. If it no longer lasts the day, a battery replacement can make a big difference.",
}

type Habit = {
  id: HabitId
  label: string
  weight: number
  /** Ties the habit back to the science on this site. */
  plating?: boolean
  devices?: DeviceId[]
  why: string
  how: Partial<Record<DeviceId, string>> & { default: string }
}

const HABITS: Habit[] = [
  {
    id: "full",
    label: "Charge to 100% and keep it there",
    weight: 15,
    why: "Sitting at a full charge for hours puts extra stress on the battery, and a nearly full anode is where lithium is most likely to plate.",
    how: {
      default: "Unplug somewhere around 80–90% on normal days.",
      iphone:
        "iPhone 15 or later: Settings › Battery › Charging, then set the limit to 80%. iPhone 14 or earlier: Settings › Battery › Battery Health & Charging, then turn on Optimized Battery Charging.",
      android:
        "Samsung: Settings › Battery › Battery protection, then choose Maximum to stop at 80%. Pixel: Settings › Battery › Charging optimization, then choose Limit to 80%.",
      mac: "System Settings › Battery, click the info button next to Battery Health, and turn on Optimized Battery Charging.",
      windows:
        "Look for a charge limit in your laptop maker's app, such as Lenovo Vantage, MyASUS, or Dell's power settings, and set it to 80%.",
      ebike: "For everyday rides, stop around 80–90% if your manual allows it, and charge to full only before a long ride.",
      ev: "Set the daily charge limit your manufacturer recommends and save 100% for road trips. Some LFP batteries are meant to reach 100% regularly, so check your manual.",
    },
    plating: true,
  },
  {
    id: "empty",
    label: "Often let it drop below 10%",
    weight: 10,
    why: "Lithium-ion batteries don't need full discharges. Running them nearly flat again and again wears them faster.",
    how: { default: "Plug in when you reach about 20–30% instead of waiting for it to die." },
  },
  {
    id: "fast",
    label: "Use fast charging most of the time",
    weight: 15,
    plating: true,
    why: "Fast charging pushes lithium into the anode quickly. If it arrives faster than the anode can take it in, some of it plates on the surface instead.",
    how: {
      default: "Keep fast charging for when you're in a hurry, and use a standard charger overnight or at your desk.",
      ev: "Use Level 2 charging at home or work for daily driving, and save DC fast charging for trips when you can.",
      ebike: "Use the standard charger that came with the bike rather than an aftermarket fast charger.",
    },
  },
  {
    id: "heat",
    label: "Charge or leave it somewhere hot",
    weight: 20,
    why: "Heat speeds up the chemical reactions that wear a battery out. It's one of the biggest causes of capacity loss.",
    how: {
      default: "Keep it out of direct sun and hot cars, and charge it in a cool, open spot.",
      iphone: "Don't charge it under a pillow or on a bed, and take off a thick case if it gets hot while charging.",
      android: "Don't charge it under a pillow or on a bed, and take off a thick case if it gets hot while charging.",
      mac: "Charge on a hard surface like a desk, not on a blanket or inside a bag.",
      windows: "Charge on a hard surface with the vents clear, not on a blanket or inside a bag.",
      ev: "Park in the shade or a garage on hot days when you can.",
    },
  },
  {
    id: "heavy",
    label: "Game or stream while it charges",
    weight: 10,
    devices: ["iphone", "android", "mac", "windows"],
    why: "Heavy use while charging heats the battery from two directions at once.",
    how: { default: "Let it charge first and then play, or lower the brightness and close extra apps while it's plugged in." },
  },
  {
    id: "cold",
    label: "Charge it right after it's been out in the cold",
    weight: 20,
    plating: true,
    why: "A cold battery takes in lithium slowly. Charging it cold, especially quickly, is one of the main causes of lithium plating, the first step toward dendrites.",
    how: {
      default: "Let it warm up to room temperature before plugging it in.",
      ebike: "Bring the battery inside and let it reach room temperature before charging. Never charge it below freezing.",
      ev: "In winter, use your car's battery preconditioning before DC fast charging, or charge right after driving while the pack is warm.",
    },
  },
  {
    id: "charger",
    label: "Use a cheap or off-brand charger",
    weight: 10,
    devices: ["iphone", "android", "mac", "windows", "ebike"],
    why: "Uncertified chargers may skip the safety circuits that protect the battery from overcharging and overheating.",
    how: {
      default: "Use the charger that came with the device, or one from a reputable brand with safety certification.",
      ebike: "Use only the manufacturer's charger, and look for UL 2849 certification when you buy a bike.",
    },
  },
]

type HealthGuide = {
  title: string
  steps: string[]
  reading: string
  source: { label: string; href: string }
}

const HEALTH: Record<DeviceId, HealthGuide> = {
  iphone: {
    title: "See your iPhone's battery health",
    steps: [
      "Open Settings and tap Battery",
      "Tap Battery Health (called Battery Health & Charging on some older models)",
      "Check Maximum Capacity. On iPhone 15 and later, the cycle count is on the same screen",
    ],
    reading:
      "Maximum Capacity compares your battery with when it was new. Apple designs iPhone 15 and later to keep about 80% after 1,000 full cycles, and earlier models after 500.",
    source: { label: "Apple support", href: "https://support.apple.com/108055" },
  },
  android: {
    title: "See your Android phone's battery health",
    steps: [
      "Samsung: open the Samsung Members app, go to Support, and tap Get Started under Phone diagnostics",
      "When the test finishes, tap Battery status to see Normal, Weak, or Bad",
      "Pixel 8a and later: Settings › Battery › Battery health, then tap Battery capacity",
    ],
    reading:
      "Pixel shows an estimated capacity compared with new. Samsung shows a status: Weak or Bad means the battery has lost a meaningful amount of capacity.",
    source: {
      label: "Google Pixel help",
      href: "https://support.google.com/pixelphone/answer/15738128?hl=en",
    },
  },
  mac: {
    title: "See your MacBook's battery health",
    steps: [
      "Open System Settings › Battery to see the status: Normal or Service Recommended",
      "For details, hold Option, click the Apple menu, and choose System Information",
      "Under Hardware, click Power to see the cycle count and maximum capacity",
    ],
    reading:
      "Recent MacBooks are rated for 1,000 cycles. Maximum capacity shows how much charge it holds compared with new.",
    source: {
      label: "TechRadar guide",
      href: "https://www.techradar.com/how-to/how-to-check-your-macbooks-battery-health",
    },
  },
  windows: {
    title: "See your Windows laptop's battery health",
    steps: [
      "Search for Command Prompt, right-click it, and choose Run as administrator",
      'Type powercfg /batteryreport /output "C:\\battery_report.html" and press Enter',
      "Open battery_report.html on your C drive and find Installed Batteries",
    ],
    reading:
      "Divide Full Charge Capacity by Design Capacity. That percentage is how much charge your battery holds compared with new. Around 50% or lower usually means it's time for a replacement.",
    source: {
      label: "Windows Central guide",
      href: "https://windowscentral.com/how-check-battery-health-windows-11",
    },
  },
  ebike: {
    title: "Track your e-bike battery's health",
    steps: [
      "Check whether your bike's app or display shows battery health. Some brands do",
      "If not, note how far you can ride on a full charge, on a similar route and in similar weather",
      "Compare that range over time, or ask a bike shop to run a battery diagnostic",
    ],
    reading:
      "A slow drop in range is normal aging. A sudden drop, or a battery that gets hot, swells, or smells, means it should be checked before you charge it again.",
    source: {
      label: "NY State battery safety",
      href: "https://www.dhses.ny.gov/node/18721",
    },
  },
  ev: {
    title: "Track your EV battery's health",
    steps: [
      "Check your car's app or settings. Many EVs show battery health or the estimated range at 100%",
      "Compare your full-charge range with when the car was new, in similar weather",
      "Ask your dealer for a battery health report at your next service",
    ],
    reading:
      "Cold weather lowers range temporarily, so compare like with like. Capacity loss is usually gradual, and EV batteries carry long warranties if it drops too far.",
    source: {
      label: "NY State battery safety",
      href: "https://www.dhses.ny.gov/node/18721",
    },
  },
}

/* --------------------------------- helpers -------------------------------- */

function band(score: number) {
  if (score >= 85) return { label: "Battery-friendly", text: "text-success", stroke: "stroke-success" }
  if (score >= 60) return { label: "A few easy wins", text: "text-warning", stroke: "stroke-warning" }
  return { label: "Room to improve", text: "text-caution", stroke: "stroke-caution" }
}

function ScoreRing({ score, stroke }: { score: number; stroke: string }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90" aria-hidden>
      <circle cx="40" cy="40" r={r} fill="none" strokeWidth="7" className="stroke-foreground/10" />
      <motion.circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        className={stroke}
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - score / 100) }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
      />
    </svg>
  )
}

function StepLabel({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/15 font-mono text-[11px] text-brand">
        {n}
      </span>
      {children}
    </p>
  )
}

/* ------------------------------ printable plan ----------------------------- */

/** A clean, paper-friendly version of the results. Only shown when printing / saving as PDF. */
function PrintablePlan({
  deviceLabel,
  ageLabel,
  ageNote,
  score,
  scoreLabel,
  habits,
  device,
  health,
}: {
  deviceLabel: string
  ageLabel: string
  ageNote: string
  score: number
  scoreLabel: string
  habits: Habit[]
  device: DeviceId
  health: HealthGuide
}) {
  return (
    <div className="hidden text-[13px] leading-relaxed text-black print:block">
      <header className="flex items-end justify-between border-b-2 border-black pb-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase">Battery Dendrites</p>
          <h1 className="font-heading text-3xl font-bold">My battery plan</h1>
          <p className="mt-1 text-neutral-600">
            {deviceLabel} · {ageLabel} old · {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold tracking-wide text-neutral-600 uppercase">Habit score</p>
          <p className="font-heading text-4xl font-bold">{score}</p>
          <p className="font-semibold">{scoreLabel}</p>
        </div>
      </header>

      <p className="mt-4 text-neutral-700">{ageNote}</p>

      <section className="mt-6">
        <h2 className="text-[11px] font-semibold tracking-[0.18em] uppercase">
          {habits.length ? "What to change, most important first" : "What to change"}
        </h2>
        {habits.length === 0 ? (
          <p className="mt-2">
            Nothing. Room-temperature charging with a gentle charger, without long stretches at 100%, is exactly
            what a battery likes.
          </p>
        ) : (
          <ol className="mt-3 space-y-3">
            {habits.map((h, i) => (
              <li key={h.id} className="flex gap-3 break-inside-avoid">
                <span className="w-5 shrink-0 font-mono font-bold">{i + 1}.</span>
                <div>
                  <p className="text-neutral-600">You said: {h.label.toLowerCase()}</p>
                  <p className="font-semibold">{h.how[device] ?? h.how.default}</p>
                  <p className="text-neutral-600">
                    {h.why}
                    {h.plating && " (Linked to lithium plating.)"}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-6 break-inside-avoid rounded-lg border border-neutral-300 p-4">
        <h2 className="text-[11px] font-semibold tracking-[0.18em] uppercase">{health.title}</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {health.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-3 text-neutral-700">{health.reading}</p>
        <p className="mt-2 text-[11px] text-neutral-500">Source: {health.source.href}</p>
        <p className="mt-3 text-neutral-700">
          My reading: ____________ % capacity on ____ / ____ / ______
        </p>
      </section>

      <p className="mt-6 text-[11px] text-neutral-500">
        A rough guide to charging habits, not a measurement of your battery. Made with the battery check-up on
        Battery Dendrites, a student project in collaboration with Prof. Ming Tang&rsquo;s group at Rice University.
      </p>
    </div>
  )
}

/* -------------------------------- component ------------------------------- */

export default function BatteryCheckup() {
  const reduced = useReducedMotion()
  const [device, setDevice] = useState<DeviceId>("iphone")
  const [age, setAge] = useState<AgeId>("1-2")
  const [habits, setHabits] = useState<HabitId[]>(["full", "fast"])

  const available = HABITS.filter((h) => !h.devices || h.devices.includes(device))
  const active = available.filter((h) => habits.includes(h.id))
  const score = Math.max(0, 100 - active.reduce((s, h) => s + h.weight, 0))
  const b = band(score)
  const ranked = [...active].sort((a, z) => z.weight - a.weight)
  const health = HEALTH[device]
  const deviceLabel = DEVICES.find((d) => d.id === device)!.label

  const toggle = (id: HabitId) =>
    setHabits((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const fade = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 8, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -6, filter: "blur(4px)" },
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <div id="battery-checkup" className="space-y-6">
      <PrintablePlan
        deviceLabel={deviceLabel}
        ageLabel={AGES.find((a) => a.id === age)!.label}
        ageNote={AGE_NOTE[age]}
        score={score}
        scoreLabel={b.label}
        habits={ranked}
        device={device}
        health={health}
      />
      <div className="print-hide overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-16px_rgb(0_0_0/0.18)] dark:shadow-none">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
              Your battery check-up
            </p>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              Advice for your device and your habits
            </h3>
            <p className="print-hide mt-1 text-sm text-muted-foreground">
              Nothing you enter leaves your browser.
            </p>
          </div>
          <SavePdfButton
            targetId="battery-checkup"
            fileName={`Battery check-up - ${deviceLabel}`}
            label="Save my plan as PDF"
            className="self-start sm:self-auto"
          />
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-10">
          {/* ------------------------------ inputs ------------------------------ */}
          <div className="space-y-7">
            <fieldset>
              <legend className="contents">
                <StepLabel n={1}>Your device</StepLabel>
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DEVICES.map((d) => {
                  const on = d.id === device
                  const Icon = d.icon
                  return (
                    <button
                      key={d.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setDevice(d.id)}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-colors",
                        on
                          ? "border-brand text-foreground"
                          : "border-border bg-background/60 text-foreground/75 hover:border-brand/40 hover:text-foreground"
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId={reduced ? undefined : "checkup-device"}
                          aria-hidden
                          className="absolute inset-0 rounded-xl bg-brand/8"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <Icon className={cn("relative h-4 w-4 shrink-0", on ? "text-brand" : "text-muted-foreground")} />
                      <span className="relative leading-tight">{d.label}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="contents">
                <StepLabel n={2}>How old is it?</StepLabel>
              </legend>
              <div className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-background p-1 shadow-inner sm:inline-flex sm:w-auto sm:rounded-full">
                {AGES.map((a) => {
                  const on = a.id === age
                  return (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setAge(a.id)}
                      className={cn(
                        "relative flex-1 rounded-full px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors sm:flex-none",
                        on ? "text-brand-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId={reduced ? undefined : "checkup-age"}
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-brand shadow-sm"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative">{a.label}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="contents">
                <StepLabel n={3}>Which of these sound like you?</StepLabel>
              </legend>
              <div className="flex flex-wrap gap-2">
                {available.map((h) => {
                  const on = habits.includes(h.id)
                  return (
                    <button
                      key={h.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(h.id)}
                      className={cn(
                        "rounded-full border px-3.5 py-2.5 text-sm font-medium transition-all",
                        on
                          ? "border-brand bg-brand text-brand-foreground shadow-sm"
                          : "border-border bg-background text-foreground/80 hover:border-brand/40 hover:text-foreground"
                      )}
                    >
                      {h.label}
                    </button>
                  )
                })}
              </div>
              {habits.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHabits([])}
                  className="print-hide mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  Clear habits
                </button>
              )}
            </fieldset>
          </div>

          {/* ------------------------------ result ------------------------------ */}
          <div className="flex flex-col rounded-2xl border border-border bg-muted/30 p-5" aria-live="polite">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ScoreRing score={score} stroke={b.stroke} />
                <span className="absolute inset-0 flex items-center justify-center font-heading text-xl font-bold text-foreground tabular-nums">
                  {score}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Habit score</p>
                <motion.p
                  key={b.label}
                  initial={reduced ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("text-2xl font-bold", b.text)}
                >
                  {b.label}
                </motion.p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{AGE_NOTE[age]}</p>

            <div className="mt-5 flex-1 border-t border-border pt-5">
              <p className="text-xs font-semibold tracking-wide text-foreground uppercase">
                {ranked.length ? `Your top changes · ${deviceLabel}` : "Your habits"}
              </p>
              <AnimatePresence mode="popLayout" initial={false}>
                {ranked.length === 0 ? (
                  <motion.div key="none" {...fade} className="mt-3 flex gap-3 text-sm leading-relaxed text-foreground/85">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    Nothing to change. Room-temperature charging with a gentle charger, without long stretches at 100%, is
                    exactly what a battery likes.
                  </motion.div>
                ) : (
                  <motion.ol key={`${device}-list`} {...fade} className="mt-3 space-y-4">
                    {ranked.slice(0, 3).map((h, i) => (
                      <li key={h.id} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-xs font-bold text-brand-foreground">
                          {i + 1}
                        </span>
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm leading-relaxed font-medium text-foreground">
                            {h.how[device] ?? h.how.default}
                          </p>
                          <p className="text-xs leading-relaxed text-muted-foreground">{h.why}</p>
                          {h.plating && (
                            <span className="inline-flex rounded-full border border-brand/25 bg-brand/5 px-2 py-0.5 text-[11px] font-medium text-brand">
                              Linked to lithium plating
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                    {ranked.length > 3 && (
                      <li className="pl-9 text-xs text-muted-foreground">
                        Start with these three. The rest matter less.
                      </li>
                    )}
                  </motion.ol>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              A rough guide to your habits, not a measurement of your battery.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------- battery health guide ------------------------- */}
      <div className="print-hide relative overflow-hidden rounded-2xl bg-brand-strong p-6 text-primary-foreground sm:p-8">
        <div
          aria-hidden
          className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={device}
            {...fade}
            className="relative grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary-foreground/70 uppercase">
                Check your capacity
              </p>
              <h4 className="mt-2 text-2xl leading-tight font-bold text-balance">{health.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">{health.reading}</p>
              <a
                href={health.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                {health.source.label}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
            <ol className="space-y-3">
              {health.steps.map((s, i) => (
                <li
                  key={s}
                  className="flex gap-4 rounded-xl border border-primary-foreground/15 bg-primary-foreground/8 p-4 backdrop-blur-sm"
                >
                  <span className="font-mono text-sm font-bold text-primary-foreground/60 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
