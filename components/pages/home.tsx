"use client"

import { Card } from "@/components/ui/card"
import {
  TriangleAlert,
  Zap,
  Snowflake,
  BatteryCharging,
  Thermometer,
  type LucideIcon,
} from "lucide-react"
import { HexagonPattern } from "../ui/hexagon-pattern"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Highlighter } from "@/components/ui/highlighter"
import NextImage from "next/image"

function RiskCard({ text1, text2 }: { text1: string; text2: string }) {
  return (
    <Card className="flex flex-row items-center gap-3 border border-destructive bg-red-100 px-4 py-3 dark:bg-red-600/60">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/60 dark:bg-red-500/60">
        <TriangleAlert className="h-4 w-4 text-destructive" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground/90">{text1}</p>
        <p className="text-sm text-destructive">{text2}</p>
      </div>
    </Card>
  )
}

function PreventionCard({
  icon: Icon,
  text1,
  text2,
}: {
  icon: LucideIcon
  text1: string
  text2: string
}) {
  return (
    <Card className="flex flex-row items-center gap-4 border border-primary/20 bg-blue-100 px-5 py-4 dark:border-cyan-900/60 dark:bg-blue-950/60">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-400/70 dark:bg-cyan-600/60">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground/90">{text1}</p>
        <p className="text-sm text-muted-foreground">{text2}</p>
      </div>
    </Card>
  )
}

const preventionTips = [
  {
    icon: Zap,
    text1: "Charge at Moderate Rates",
    text2: "Fast charging pushes ions in faster than they can settle evenly, encouraging dendrite growth.",
  },
  {
    icon: Snowflake,
    text1: "Avoid Charging in the Cold",
    text2: "Charging below freezing slows ion diffusion, making uneven, dendrite-prone plating more likely.",
  },
  {
    icon: BatteryCharging,
    text1: "Don't Overcharge",
    text2: "Sitting at 100% for long periods stresses the electrode and encourages filament growth.",
  },
  {
    icon: Thermometer,
    text1: "Keep Temperatures Moderate",
    text2: "Excess heat during charging accelerates degradation and uneven lithium deposition.",
  },
]

// Update these src paths to wherever you place the PNGs.
// darkSrc is optional — only set it for icons that have a dark-mode variant.
const dailyLifeItems = [
  {
    label: "E-bikes/Scooters",
    src: "/icons/ebike.png",
    darkSrc: "/icons/ebikedark.png",
  },
  {
    label: "Consumer Electronics",
    src: "/icons/consumertech.png",
    darkSrc: "/icons/consumertechdark.png",
  },
  { label: "Electric Vehicles", src: "/icons/evehicle.png" },
  { label: "Aviation", src: "/icons/aviation.png" },
]

function DailyLifeCard({
  label,
  src,
  darkSrc,
  isDark,
}: {
  label: string
  src: string
  darkSrc?: string
  isDark: boolean
}) {
  const activeSrc = isDark && darkSrc ? darkSrc : src

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-28 w-28">
        <NextImage
          src={activeSrc}
          alt={label}
          fill
          sizes="112px"
          className="object-contain"
        />
      </div>
      <p className="text-center text-base font-bold text-foreground">
        {label}
      </p>
    </div>
  )
}

export default function HomepageClientView() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(handle)
  }, [])

  return (
    mounted && (
      <div className="min-h-screen bg-background font-sans">
        <div className="relative h-screen w-full max-w-screen overflow-hidden">
          <div className="relative z-10 flex h-full w-full pl-20">
            <div className="relative top-full flex max-w-2xl -translate-y-1/2 flex-col gap-4">
              <h1 className="text-7xl font-bold">
                Solving{" "}
                <Highlighter
                  action="underline"
                  color="var(--color-destructive)"
                >
                  Dendrites
                </Highlighter>
              </h1>
              <h2 className="text-4xl text-primary">
                A demo by the <Highlighter color="var(--color-accent-foreground)">Rice University</Highlighter> Material Science Lab
              </h2>
            </div>
          </div>

          <HexagonPattern
            style={{
              maskImage:
                "linear-gradient(to bottom right, white 0%, white 20%, transparent 80%), linear-gradient(to bottom, white 0%, white 40%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskImage:
                "linear-gradient(to bottom right, white 0%, white 20%, transparent 80%), linear-gradient(to bottom, white 0%, white 40%, transparent 100%)",
              WebkitMaskComposite: "destination-in",
            }}
            gap={10}
            radius={30}
            color={isDark ? "oklch(1 0 0 / 10%)" : "#727272"}
            className={cn(
              "absolute inset-0",
              "origin-center scale-[1.5]",
              "transform-[rotateX(20deg)_rotateY(20deg)] perspective-[1000px]",
              "[mask:linear-gradient(to_bottom_right,white_0%,white_20%,rgba(255,255,255,0.01)_80%),linear-gradient(to_bottom,white_0%,white_70%,transparent_100%)]"
            )}
            colored={30}
          />
        </div>
        <main className="mx-auto h-full max-w-5xl space-y-6 p-6">
          <Card className="grid grid-cols-1 gap-10 rounded-2xl p-8 shadow-sm md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
                  Overview
                </p>
                <h2 className="text-2xl font-bold text-foreground">
                  What are dendrites?
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every time a lithium battery charges, lithium ions move to the
                negative electrode and deposit as metal. Under ideal conditions,
                that metal lays down as a smooth, even layer. But under certain
                conditions, the metal instead grows in thin, branching filaments
                called dendrites.
              </p>
              <div className="flex h-40 items-center justify-center rounded-2xl bg-primary">
                <p className="text-center leading-snug font-semibold text-white">
                  Sim coming soon!
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-bold tracking-widest text-destructive uppercase">
                  The Risk
                </p>
                <h2 className="text-2xl font-bold text-foreground">
                  Why are they dangerous?
                </h2>
              </div>
              <div className="space-y-3">
                <RiskCard
                  text1="Short Circuits"
                  text2="Dendrites pierce the protective internal separator to cause fatal battery short circuits."
                />
                <RiskCard
                  text1="Accelerated Capacity Loss"
                  text2="Dendrites permanently trap lithium ions to drastically reduce the battery lifespan."
                />
                <RiskCard
                  text1="Thermal Runaway and Fires"
                  text2="Dendrite short circuits spark intense heat that triggers explosive battery fires."
                />
              </div>
            </div>
            <div className="col-span-2">
              <h2 className="text-2xl font-bold">
                Where this shows up in daily life
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Lithium-ion batteries are in nearly everything that holds a
                charge: phones, laptops, power tools, power banks, e-bikes and
                scooters, hearing aids, and of course electric vehicles and
                grid-scale storage.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {dailyLifeItems.map((item) => (
                  <DailyLifeCard key={item.label} {...item} isDark={isDark} />
                ))}
              </div>
            </div>
          </Card>

          <Card className="space-y-4 rounded-2xl p-8 shadow-sm">
            <div>
              <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
                Prevention
              </p>
              <h2 className="text-2xl font-bold text-foreground">
                Dendrite Prevention Tips
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A few habits keep lithium plating slow, even, and manageable.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {preventionTips.map((tip) => (
                <PreventionCard key={tip.text1} {...tip} />
              ))}
            </div>
          </Card>
        </main>
      </div>
    )
  )
}
