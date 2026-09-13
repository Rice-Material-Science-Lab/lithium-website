"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TriangleAlert,
  Zap,
  Snowflake,
  BatteryCharging,
  Thermometer,
  Microscope,
  Atom,
  Activity,
  Waves,
  Layers,
  ShieldCheck,
  Timer,
  BrainCircuit,
  CheckCircle2,
  XCircle,
  RotateCcw,
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


const formationSteps = [
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

function FormationMechanism() {
  return (
    <div className="col-span-2 space-y-4">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Mechanism
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          How a dendrite actually forms
        </h2>
      </div>
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        {formationSteps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground dark:bg-cyan-600">
                {i + 1}
              </span>
              {i < formationSteps.length - 1 && (
                <span className="hidden h-px flex-1 bg-border sm:block" />
              )}
            </div>
            <p className="text-sm font-semibold text-foreground/90">
              {step.title}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

const glossaryTerms = [
  {
    term: "Anode",
    definition:
      "The electrode that hosts lithium during discharge (graphite or metal); where dendrites typically nucleate.",
  },
  {
    term: "Cathode",
    definition:
      "The positive electrode that lithium ions travel toward during discharge, and away from during charging.",
  },
  {
    term: "Electrolyte",
    definition:
      "The liquid, gel, or solid medium that carries lithium ions between the anode and cathode.",
  },
  {
    term: "Separator",
    definition:
      "A thin, porous membrane that physically keeps the electrodes apart while still letting ions pass through.",
  },
  {
    term: "SEI Layer",
    definition:
      "Solid Electrolyte Interphase — a thin passivation film that forms on the anode from electrolyte breakdown, shaping how evenly lithium plates.",
  },
  {
    term: "Thermal Runaway",
    definition:
      "A self-accelerating chain reaction where heat from an internal failure triggers more heat, often ending in fire or explosion.",
  },
  {
    term: "Dendrite",
    definition:
      "A branching, needle-like filament of metallic lithium that forms from uneven plating during charging.",
  },
  {
    term: "Cycle Life",
    definition:
      "The number of charge/discharge cycles a battery can undergo before its usable capacity drops significantly.",
  },
  {
    term: "Energy Density",
    definition:
      "How much energy a battery stores per unit of weight or volume — the main driver of range and runtime.",
  },
]

function GlossarySection() {
  return (
    <Card className="space-y-4 rounded-2xl p-8 shadow-sm">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Reference
        </p>
        <h2 className="text-2xl font-bold text-foreground">Glossary</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The vocabulary you'll run into throughout this site.
        </p>
      </div>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {glossaryTerms.map((g) => (
          <div key={g.term} className="rounded-xl border border-border p-4">
            <dt className="text-sm font-bold text-foreground">{g.term}</dt>
            <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {g.definition}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}


const chemistryRows = [
  {
    label: "Typical energy density",
    nmc: "~200–270 Wh/kg",
    lfp: "~150–160 Wh/kg",
    solidState: "300+ Wh/kg (projected)",
  },
  {
    label: "Dendrite susceptibility",
    nmc: "Higher",
    lfp: "Lower",
    solidState: "Lower at the electrode, but can form along grain boundaries",
  },
  {
    label: "Thermal stability",
    nmc: "Moderate",
    lfp: "High",
    solidState: "High (no flammable liquid electrolyte)",
  },
  {
    label: "Typical cycle life",
    nmc: "~1,000–2,000 cycles",
    lfp: "~3,000–6,000 cycles",
    solidState: "Still being characterized",
  },
  {
    label: "Commercial maturity",
    nmc: "Mature, widespread",
    lfp: "Mature, widespread",
    solidState: "Early-stage / pilot production",
  },
]

function ChemistryComparison() {
  return (
    <Card className="space-y-4 rounded-2xl p-8 shadow-sm">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Chemistry
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          Not all lithium batteries carry the same risk
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Chemistry changes how easily dendrites form and how a cell behaves
          if one gets through anyway.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold text-foreground/70">
                &nbsp;
              </th>
              <th className="py-2 pr-4 font-semibold text-foreground">
                NMC
              </th>
              <th className="py-2 pr-4 font-semibold text-foreground">
                LFP
              </th>
              <th className="py-2 pr-4 font-semibold text-foreground">
                Solid-State
              </th>
            </tr>
          </thead>
          <tbody>
            {chemistryRows.map((row) => (
              <tr key={row.label} className="border-b border-border/60">
                <td className="py-3 pr-4 font-medium text-muted-foreground">
                  {row.label}
                </td>
                <td className="py-3 pr-4 text-foreground/90">{row.nmc}</td>
                <td className="py-3 pr-4 text-foreground/90">{row.lfp}</td>
                <td className="py-3 pr-4 text-foreground/90">
                  {row.solidState}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}


const detectionMethods = [
  {
    icon: Microscope,
    text1: "In-Situ Microscopy",
    text2: "Optical and electron microscopy image dendrite nucleation and growth in real time inside a live cell.",
  },
  {
    icon: Atom,
    text1: "Neutron Imaging",
    text2: "Neutrons are far more sensitive to lithium than X-rays, revealing metal distribution X-ray CT can miss.",
  },
  {
    icon: Activity,
    text1: "Impedance Spectroscopy",
    text2: "Tracking how internal resistance shifts over cycles flags the early signs of uneven plating.",
  },
  {
    icon: Waves,
    text1: "Acoustic Emission",
    text2: "Dendrite growth and fracture emit faint stress waves that acoustic sensors can pick up non-destructively.",
  },
]

function DetectionSection() {
  return (
    <Card className="space-y-4 rounded-2xl p-8 shadow-sm">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Detection
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          How researchers actually see dendrites
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Dendrites form inside a sealed cell, so studying them takes
          specialized imaging and sensing.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {detectionMethods.map((m) => (
          <PreventionCard key={m.text1} {...m} />
        ))}
      </div>
    </Card>
  )
}

const solutions = [
  {
    icon: Layers,
    text1: "Solid Electrolytes",
    text2: "A rigid electrolyte can physically resist penetration in a way liquid electrolytes can't.",
  },
  {
    icon: ShieldCheck,
    text1: "Artificial SEI Coatings",
    text2: "Engineered protective layers promote a smoother, more uniform flow of lithium ions.",
  },
  {
    icon: Timer,
    text1: "Pulse Charging",
    text2: "Alternating charge and rest pulses give ions time to settle evenly instead of piling up.",
  },
  {
    icon: BrainCircuit,
    text1: "Smart Battery Management",
    text2: "ML-driven battery management systems adjust current in real time based on temperature and impedance.",
  },
]

function SolutionsSection() {
  return (
    <Card className="space-y-4 rounded-2xl p-8 shadow-sm">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Research
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          What's being done about it
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          None of these fully solve dendrite growth on their own — most
          products combine several.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {solutions.map((s) => (
          <PreventionCard key={s.text1} {...s} />
        ))}
      </div>
    </Card>
  )
}


const stats = [
  { value: "$5B+", label: "Cost of the Samsung Note7 recall" },
  { value: "$2B+", label: "Cost of the Chevy Bolt EV recall" },
  { value: "20+", label: "Deaths from NYC e-bike battery fires in 2023" },
  { value: "6+ hrs", label: "Burn time of the Victorian Big Battery fire" },
]

function StatsStrip() {
  return (
    <Card className="rounded-2xl p-8 shadow-sm">
      <div className="mb-6">
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          By the numbers
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          The stakes, in scale
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="space-y-1">
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}


interface QuizQuestion {
  id: string
  prompt: string
  options: { id: string; text: string }[]
  correctId: string
  explanation: string
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What primarily causes lithium dendrites to form during charging?",
    options: [
      { id: "a", text: "Uneven deposition of lithium ions on the anode" },
      { id: "b", text: "Overheating of the cathode" },
      { id: "c", text: "Excess electrolyte volume" },
      { id: "d", text: "The separator aging over time" },
    ],
    correctId: "a",
    explanation:
      "Dendrites start when lithium plates unevenly instead of as a smooth layer, building up at microscopic high points.",
  },
  {
    id: "q2",
    prompt: "What's the main danger dendrites pose to a battery?",
    options: [
      { id: "a", text: "They make the battery lighter" },
      { id: "b", text: "They can pierce the separator and short-circuit the cell" },
      { id: "c", text: "They increase the battery's voltage" },
      { id: "d", text: "They speed up charging time" },
    ],
    correctId: "b",
    explanation:
      "Once a dendrite bridges the gap between electrodes, it creates a direct short circuit that can trigger thermal runaway.",
  },
  {
    id: "q3",
    prompt: "Which battery chemistry is generally most resistant to thermal runaway?",
    options: [
      { id: "a", text: "NMC" },
      { id: "b", text: "LFP" },
      { id: "c", text: "Lead-acid" },
    ],
    correctId: "b",
    explanation:
      "LFP (lithium iron phosphate) is known for higher thermal stability than NMC chemistries, though it trades off some energy density.",
  },
  {
    id: "q4",
    prompt: "What does the SEI layer do?",
    options: [
      { id: "a", text: "Measures battery health remotely" },
      { id: "b", text: "Forms a protective film on the anode from electrolyte breakdown" },
      { id: "c", text: "Physically separates the anode and cathode" },
      { id: "d", text: "Speeds up electron flow to the cathode" },
    ],
    correctId: "b",
    explanation:
      "The Solid Electrolyte Interphase is a thin passivation layer that strongly influences how evenly lithium plates on the anode.",
  },
  {
    id: "q5",
    prompt: "Which charging habit helps reduce dendrite risk?",
    options: [
      { id: "a", text: "Fast-charging every time" },
      { id: "b", text: "Charging in freezing temperatures" },
      { id: "c", text: "Charging at moderate rates and avoiding extremes" },
      { id: "d", text: "Leaving the battery at 100% for weeks" },
    ],
    correctId: "c",
    explanation:
      "Moderate charging rates and temperatures give lithium ions time to settle evenly, which is the single biggest lever a user controls.",
  },
]

function QuizSection() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = quizQuestions[index]
  const isLast = index === quizQuestions.length - 1

  function handleSelect(optionId: string) {
    if (selected) return
    setSelected(optionId)
    if (optionId === question.correctId) setScore((s) => s + 1)
  }

  function handleNext() {
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  function handleRestart() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  return (
    <Card className="space-y-4 rounded-2xl p-8 shadow-sm">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Check yourself
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          Quick dendrite quiz
        </h2>
      </div>

      {finished ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-3xl font-bold text-foreground">
            {score} / {quizQuestions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {score === quizQuestions.length
              ? "Perfect score — you know your dendrites."
              : "Nice work. Scroll back up for a refresher on anything you missed."}
          </p>
          <Button onClick={handleRestart} variant="outline" className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Retake Quiz
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted-foreground">
            Question {index + 1} of {quizQuestions.length}
          </p>
          <p className="text-base font-semibold text-foreground">
            {question.prompt}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {question.options.map((opt) => {
              const isCorrect = opt.id === question.correctId
              const isChosen = opt.id === selected
              const revealed = selected !== null

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={revealed}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    !revealed && "border-border hover:border-primary/50",
                    revealed && isCorrect && "border-green-500 bg-green-500/10",
                    revealed &&
                      isChosen &&
                      !isCorrect &&
                      "border-destructive bg-red-500/10",
                    revealed && !isCorrect && !isChosen && "border-border opacity-60"
                  )}
                >
                  <span>{opt.text}</span>
                  {revealed && isCorrect && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                  )}
                  {revealed && isChosen && !isCorrect && (
                    <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                  )}
                </button>
              )
            })}
          </div>

          {selected && (
            <div className="space-y-3 rounded-xl bg-muted/50 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {question.explanation}
              </p>
              <Button onClick={handleNext} size="sm">
                {isLast ? "See Score" : "Next Question"}
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
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

            <FormationMechanism />

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

          <ChemistryComparison />
          <DetectionSection />
          <SolutionsSection />
          <StatsStrip />
          <GlossarySection />
          <QuizSection />
        </main>
      </div>
    )
  )
}
