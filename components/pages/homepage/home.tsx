"use client"

import Link from "next/link"
import NextImage from "next/image"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
  ArrowRight,
  BatteryLow,
  Flame,
  FlaskConical,
  Zap,
} from "lucide-react"

import BatteryBasics from "./section-cards/battery-basics"
import DendriteFormation from "./section-cards/dendrite-formation"
import { ChapterNav, ReadingProgress, type Chapter } from "./chapter-nav"
import {
  Eyebrow,
  FeatureCard,
  Panel,
  Reveal,
  SectionShell,
} from "./layout-primitives"
import PreventionSection from "./section-cards/prevention-section"
import ChemistryComparison from "./section-cards/chemistry-comparison"
import DetectionSection from "./section-cards/detection-methods"
import SolutionsSection from "./section-cards/solution-section"
import StatsStrip from "./section-cards/stats-strip"
import GlossarySection from "./section-cards/glossary-section"
import QuizSection from "./section-cards/quiz-section"
import Hero from "./section-cards/hero"

const chapters: Chapter[] = [
  { id: "basics", label: "How batteries work" },
  { id: "dendrites", label: "What are dendrites?" },
  { id: "everyday", label: "Everyday impact" },
  { id: "prevention", label: "Prevention" },
  { id: "chemistry", label: "Anode chemistry" },
  { id: "detection", label: "Detection" },
  { id: "solutions", label: "Engineering fixes" },
  { id: "glossary", label: "Glossary" },
]

const risks = [
  {
    icon: Zap,
    title: "Short circuits",
    text: "Dendrites pierce the protective internal separator to cause fatal battery short circuits.",
  },
  {
    icon: BatteryLow,
    title: "Accelerated capacity loss",
    text: "Dendrites permanently trap lithium ions to drastically reduce the battery lifespan.",
  },
  {
    icon: Flame,
    title: "Thermal runaway and fires",
    text: "Dendrite short circuits spark intense heat that triggers explosive battery fires.",
  },
]

const dailyLifeItems = [
  {
    label: "E-bikes & scooters",
    src: "/icons/ebike.png",
    darkSrc: "/icons/ebikedark.png",
  },
  {
    label: "Consumer electronics",
    src: "/icons/consumertech.png",
    darkSrc: "/icons/consumertechdark.png",
  },
  { label: "Electric vehicles", src: "/icons/evehicle.png" },
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
    <div className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-20px_rgb(0_0_0/0.35)]">
      <div className="relative h-20 w-20 transition-transform duration-500 group-hover:scale-110 sm:h-24 sm:w-24">
        <NextImage
          src={activeSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 80px, 96px"
          className="object-contain"
        />
      </div>
      <p className="text-center text-sm font-semibold text-foreground">
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
    const handle = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(handle)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background font-sans">
      <ReadingProgress />
      <Hero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14 lg:px-8">
        <ChapterNav chapters={chapters} />

        <main className="min-w-0 divide-y divide-border">
          <SectionShell
            id="basics"
            index="01"
            eyebrow="The basics"
            title="How a lithium-ion battery works"
            description="Every lithium-ion battery is a sandwich: two electrodes, a liquid electrolyte between them, and a thin separator that keeps them apart. Energy is stored by moving lithium ions from one side to the other and back again."
          >
            <BatteryBasics />
          </SectionShell>

          <SectionShell
            id="dendrites"
            index="02"
            eyebrow="The problem"
            title="What are dendrites?"
            description="Every time a lithium battery charges, lithium ions move to the negative electrode. Ideally they tuck neatly inside it. Under the wrong conditions, the lithium instead grows as thin, branching metal filaments called dendrites."
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {risks.map((r) => (
                  <FeatureCard
                    key={r.title}
                    icon={r.icon}
                    title={r.title}
                    tone="danger"
                  >
                    {r.text}
                  </FeatureCard>
                ))}
              </div>

              <Panel>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground">
                    How a dendrite actually forms
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Play through the five stages, or tap any step to jump to it.
                  </p>
                </div>
                <DendriteFormation />
              </Panel>

              <Link
                href="/sim"
                className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:bg-cyan-900"
              >
                <div
                  aria-hidden
                  className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-125"
                />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      Watch dendrites grow atom by atom
                    </p>
                    <p className="mt-1 text-sm text-primary-foreground/80">
                      Our kinetic Monte Carlo simulator lets you change the
                      conditions and see what the lithium does.
                    </p>
                  </div>
                </div>
                <span className="relative inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1 sm:self-auto dark:text-cyan-900">
                  Open the simulator
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </SectionShell>

          <SectionShell
            id="everyday"
            index="03"
            eyebrow="Why it matters"
            title="Where this shows up in daily life"
            description="Lithium-ion batteries are in nearly everything that holds a charge: phones, laptops, power tools, power banks, e-bikes and scooters, hearing aids, electric vehicles, and grid-scale storage. When they fail, the costs add up fast."
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {dailyLifeItems.map((item) => (
                  <DailyLifeCard key={item.label} {...item} isDark={isDark} />
                ))}
              </div>
              <StatsStrip />
            </div>
          </SectionShell>

          <SectionShell
            id="prevention"
            index="04"
            eyebrow="Best practices"
            title="Keeping dendrites at bay"
            description="A few everyday habits keep lithium plating slow, even, and manageable."
          >
            <PreventionSection />
          </SectionShell>

          <SectionShell
            id="chemistry"
            index="05"
            eyebrow="Chemistry"
            title="The anode decides how easily dendrites grow"
            description="Dendrites grow on the anode, the negative electrode that lithium flows into while charging. What it's made of changes how likely lithium is to pile up as metal, and it trades off against how much energy the battery holds and how long it lasts."
          >
            <ChemistryComparison />
          </SectionShell>

          <SectionShell
            id="detection"
            index="06"
            eyebrow="Detection"
            title="How researchers actually see dendrites"
            description="Dendrites are microscopic and hidden inside a sealed cell, so seeing them takes X-rays, electron beams, and specially built cells."
          >
            <DetectionSection />
          </SectionShell>

          <SectionShell
            id="solutions"
            index="07"
            eyebrow="Engineering"
            title="What's being done about it"
            description="None of these fully solve dendrite growth on their own. Most products combine several."
          >
            <SolutionsSection />
          </SectionShell>

          <SectionShell
            id="glossary"
            index="08"
            eyebrow="Reference"
            title="Glossary"
            description="The vocabulary you'll run into throughout this site."
          >
            <GlossarySection />
          </SectionShell>
        </main>
      </div>

      <section
        id="quiz"
        aria-labelledby="quiz-title"
        className="relative mt-8 overflow-hidden border-t border-border bg-linear-to-b from-primary/10 via-background to-background py-20 sm:py-28 dark:from-cyan-950/40"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 h-80 w-3xl -translate-x-1/2 rounded-full bg-primary/20 blur-3xl dark:bg-cyan-500/10"
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="mb-10 text-center">
            <Eyebrow className="justify-center">Check yourself</Eyebrow>
            <h2
              id="quiz-title"
              className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
            >
              How well do you know your dendrites?
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Six quick questions on everything above.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <QuizSection />
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:px-8">
          <p>
            <span className="font-heading font-bold text-foreground">
              Battery Dendrites
            </span>{" "}
            · Rice University Mesoscale Materials Science Group
          </p>
          <nav className="flex gap-5">
            <Link href="/sim" className="hover:text-foreground">
              Simulator
            </Link>
            <Link href="/library" className="hover:text-foreground">
              Library
            </Link>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="hover:text-foreground"
            >
              Back to top
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}