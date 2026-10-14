"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Bike, Car, Check, Laptop, Smartphone, X, type LucideIcon } from "lucide-react"
import { useState } from "react"

type Device = {
  id: string
  label: string
  icon: LucideIcon
  headline: string
  intro: string
  dos: string[]
  donts: string[]
  keyHabit: { title: string; text: string }
}

const devices: Device[] = [
  {
    id: "phone",
    label: "Phone",
    icon: Smartphone,
    headline: "Your phone charges every day, so small habits add up.",
    intro:
      "Phones are charged more often than almost anything else you own. Heat and long stretches at 100% are what wear the battery fastest.",
    dos: [
      "Turn on Optimized or Adaptive Charging so the phone waits near 80% until you need it",
      "Use the charger that came with it, or one from a reputable brand",
      "Take off a thick case if the phone gets hot while charging",
    ],
    donts: [
      "Charge it under a pillow, on a bed, or in a hot car",
      "Keep using it if the screen or back starts lifting away from the frame",
    ],
    keyHabit: {
      title: "Let the software help",
      text: "Built-in charge limits keep the battery out of the highest charge levels, where lithium is most likely to plate.",
    },
  },
  {
    id: "laptop",
    label: "Laptop",
    icon: Laptop,
    headline: "A laptop that lives on the charger needs a charge limit.",
    intro:
      "Many laptops sit plugged in all day at 100%, often while running warm. That combination is hard on the battery over months and years.",
    dos: [
      "Turn on the battery health or charge limit setting if your laptop has one",
      "Keep the vents clear, and use it on a desk rather than a blanket",
      "Store it about half charged if you won't use it for a few weeks",
    ],
    donts: [
      "Charge it inside a bag or under bedding",
      "Ignore a trackpad or case that starts to bulge, which can mean a swollen battery",
    ],
    keyHabit: {
      title: "Cool and partly charged",
      text: "A laptop that stays cool and below full charge keeps its capacity much longer than one parked at 100% and running hot.",
    },
  },
  {
    id: "ebike",
    label: "E-bike & scooter",
    icon: Bike,
    headline: "Large batteries, charged indoors, need the most care.",
    intro:
      "E-bike and scooter packs hold far more energy than a phone, and they are often charged inside homes. Where and how you charge them matters most.",
    dos: [
      "Buy bikes certified to UL 2849, and batteries certified to UL 2271",
      "Use only the manufacturer's charger, plugged straight into a wall outlet",
      "Let the battery cool down after a ride before you charge it",
      "Charge it in an area you can keep an eye on, away from exits",
    ],
    donts: [
      "Leave it charging overnight or while no one is home",
      "Buy refurbished or rebuilt packs, or mix chargers between brands",
    ],
    keyHabit: {
      title: "Certified, supervised, away from exits",
      text: "If a large pack does fail, a certified design and a charging spot away from your way out make the biggest difference.",
    },
  },
  {
    id: "ev",
    label: "Electric vehicle",
    icon: Car,
    headline: "Set a daily charge limit and save fast charging for trips.",
    intro:
      "EV battery packs are carefully managed, but your settings still shape how they age, especially with fast charging and cold weather.",
    dos: [
      "Set the daily charge limit your manufacturer recommends, and charge to 100% only before long trips",
      "In cold weather, use your car's battery preconditioning before DC fast charging",
      "Check for recalls on your vehicle and follow any interim charging advice",
    ],
    donts: [
      "Rely on DC fast charging every day when slower charging will do",
      "Ignore battery warnings on the dashboard",
    ],
    keyHabit: {
      title: "Warm before fast",
      text: "A cold battery takes in lithium slowly. Fast charging it cold is one of the main conditions for lithium plating, which is why preconditioning exists.",
    },
  },
]

export default function DeviceGuide() {
  const [active, setActive] = useState(devices[0].id)
  const reduced = useReducedMotion()
  const d = devices.find((x) => x.id === active)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-16px_rgb(0_0_0/0.18)] dark:shadow-none">
      <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:px-8 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
            Check your device
          </p>
          <h3 className="mt-1 text-xl font-bold text-foreground">
            What to do for the batteries you own
          </h3>
        </div>
        <div
          role="tablist"
          aria-label="Device type"
          className="inline-flex w-full gap-1 overflow-x-auto rounded-full bg-background p-1 shadow-inner [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:w-auto"
        >
          {devices.map((x) => {
            const selected = x.id === active
            const Icon = x.icon
            return (
              <button
                key={x.id}
                role="tab"
                id={`device-tab-${x.id}`}
                aria-selected={selected}
                aria-controls="device-panel"
                onClick={() => setActive(x.id)}
                className={cn(
                  "relative flex shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
                  selected ? "text-brand-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {selected && (
                  <motion.span
                    layoutId={reduced ? undefined : "device-pill"}
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-brand shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative">{x.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        id="device-panel"
        role="tabpanel"
        aria-labelledby={`device-tab-${d.id}`}
        aria-live="polite"
        className="p-5 sm:p-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={d.id}
            initial={reduced ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduced ? undefined : { opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10"
          >
            <div className="flex flex-col gap-5">
              <div className="space-y-3">
                <h4 className="font-heading text-2xl leading-tight font-bold tracking-tight text-balance text-foreground">
                  {d.headline}
                </h4>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{d.intro}</p>
              </div>
              <div className="relative mt-auto overflow-hidden rounded-xl bg-brand-strong p-5 text-primary-foreground">
                <div
                  aria-hidden
                  className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary-foreground/10 blur-2xl"
                />
                <p className="relative text-xs font-semibold tracking-[0.14em] text-primary-foreground/70 uppercase">
                  The one habit
                </p>
                <p className="relative mt-1 text-lg font-bold">{d.keyHabit.title}</p>
                <p className="relative mt-1.5 text-sm leading-relaxed text-primary-foreground/85">
                  {d.keyHabit.text}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/60 p-5">
                <p className="text-xs font-semibold tracking-wide text-success uppercase">Do</p>
                <ul className="mt-3 space-y-3">
                  {d.dos.map((t) => (
                    <li key={t} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-background/60 p-5">
                <p className="text-xs font-semibold tracking-wide text-caution uppercase">Avoid</p>
                <ul className="mt-3 space-y-3">
                  {d.donts.map((t) => (
                    <li key={t} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-caution/15 text-caution">
                        <X className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
