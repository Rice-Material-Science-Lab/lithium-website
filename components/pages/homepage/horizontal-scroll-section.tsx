"use client"

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import ChemistryComparison from "./section-cards/chemistry-comparison"
import DetectionSection from "./section-cards/detection-methods"
import SolutionsSection from "./section-cards/solution-section"
import StatsStrip from "./section-cards/stats-strip"
import GlossarySection from "./section-cards/glossary-section"
import QuizSection from "./section-cards/quiz-section"
import PreventionSection from "./section-cards/prevention-section"

const PANEL_COUNT = 7
const STEP_SIZE = 1 / (PANEL_COUNT - 1)
const SNAP_THRESHOLD = 0.08
const SNAP_DEBOUNCE_MS = 100
const SNAP_DURATION_MS = 280
const FLOAT_DISTANCE = 32

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

function animateScrollTo(
  targetY: number,
  duration: number,
  onDone: () => void
) {
  const startY = window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  function step(now: number) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    const eased = easeOutQuart(t)
    window.scrollTo(0, startY + distance * eased)

    if (t < 1) {
      requestAnimationFrame(step)
    } else {
      onDone()
    }
  }

  requestAnimationFrame(step)
}

function Panel({
  index,
  progress,
  children,
}: {
  index: number
  progress: MotionValue<number>
  children: ReactNode
}) {
  const center = index * STEP_SIZE
  const isFirst = index === 0
  const isLast = index === PANEL_COUNT - 1

  const inputRange = isFirst
    ? [center, center + STEP_SIZE]
    : isLast
      ? [center - STEP_SIZE, center]
      : [center - STEP_SIZE, center, center + STEP_SIZE]

  const opacityRange = isFirst ? [1, 0] : isLast ? [0, 1] : [0, 1, 0]
  const yRange = isFirst
    ? [0, FLOAT_DISTANCE]
    : isLast
      ? [FLOAT_DISTANCE, 0]
      : [FLOAT_DISTANCE, 0, FLOAT_DISTANCE]

  const opacity = useTransform(progress, inputRange, opacityRange)
  const y = useTransform(progress, inputRange, yRange)

  return (
    <motion.div
      style={{ opacity, y }}
      className="flex h-screen w-screen shrink-0 items-center justify-center"
    >
      {children}
    </motion.div>
  )
}

export default function HorizontalScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null)
  const isSnappingRef = useRef(false)
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollYRef = useRef(0)
  const directionRef = useRef<"down" | "up">("down")
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-600vw"])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      PANEL_COUNT - 1,
      Math.max(0, Math.round(latest / STEP_SIZE))
    )
    setActiveIndex((prev) => (prev !== idx ? idx : prev))
  })

  useEffect(() => {
    lastScrollYRef.current = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      directionRef.current = currentY > lastScrollYRef.current ? "down" : "up"
      lastScrollYRef.current = currentY

      if (isSnappingRef.current) return
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current)

      snapTimeoutRef.current = setTimeout(() => {
        const el = targetRef.current
        if (!el) return

        const progress = scrollYProgress.get()
        if (progress <= 0 || progress >= 1) return

        const raw = progress / STEP_SIZE
        const floor = Math.floor(raw)
        const frac = raw - floor

        let nearestIndex: number
        if (directionRef.current === "down") {
          nearestIndex = frac > SNAP_THRESHOLD ? floor + 1 : floor
        } else {
          nearestIndex = frac < 1 - SNAP_THRESHOLD ? floor : floor + 1
        }
        nearestIndex = Math.min(Math.max(nearestIndex, 0), PANEL_COUNT - 1)

        const scrollableHeight = el.offsetHeight - window.innerHeight
        const targetProgress = nearestIndex * STEP_SIZE
        const rect = el.getBoundingClientRect()
        const sectionTop = window.scrollY + rect.top
        const targetY = sectionTop + targetProgress * scrollableHeight

        if (Math.abs(window.scrollY - targetY) > 2) {
          isSnappingRef.current = true
          animateScrollTo(targetY, SNAP_DURATION_MS, () => {
            isSnappingRef.current = false
          })
        }
      }, SNAP_DEBOUNCE_MS)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current)
    }
  }, [scrollYProgress])

  const panels: ReactNode[] = [
    <PreventionSection key="prevention" />,
    <ChemistryComparison key="chemistry" />,
    <DetectionSection key="detection" />,
    <SolutionsSection key="solutions" />,
    <StatsStrip key="stats" />,
    <GlossarySection key="glossary" />,
    <QuizSection key="quiz" />,
  ]

  return (
    <section ref={targetRef} className="relative h-[700vh]">
      <div className="sticky top-0 z-10 flex h-screen items-center overflow-hidden">
        <div className="absolute top-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {Array.from({ length: PANEL_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-10 rounded-full transition-colors duration-300 ${
                i <= activeIndex ? "bg-primary" : "bg-foreground/15"
              }`}
            />
          ))}
          {scrollYProgress.get()}
        </div>
        <motion.div style={{ x }} className="relative top-0 flex w-max">
          {panels.map((panel, i) => (
            <Panel key={i} index={i} progress={scrollYProgress}>
              {panel}
            </Panel>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
