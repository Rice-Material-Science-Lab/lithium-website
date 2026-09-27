"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useEffect, useRef } from "react"
import ChemistryComparison from "./section-cards/chemistry-comparison"
import DetectionSection from "./section-cards/detection-methods"
import SolutionsSection from "./section-cards/solution-section"
import StatsStrip from "./section-cards/stats-strip"
import GlossarySection from "./section-cards/glossary-section"
import QuizSection from "./section-cards/quiz-section"
import PreventionSection from "./section-cards/prevention-section"

const PANEL_COUNT = 7
const SNAP_THRESHOLD = 0.08
const SNAP_DEBOUNCE_MS = 60
const SNAP_DURATION_MS = 280

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

function animateScrollTo(targetY: number, duration: number, onDone: () => void) {
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

export default function HorizontalScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null)
  const isSnappingRef = useRef(false)
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollYRef = useRef(0)
  const directionRef = useRef<"down" | "up">("down")

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-600vw"])

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

        const stepSize = 1 / (PANEL_COUNT - 1)
        const raw = progress / stepSize
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
        const targetProgress = nearestIndex * stepSize
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

  return (
    <section ref={targetRef} className="relative h-[700vh]">
      <div className="sticky top-0 z-10 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="relative top-0 flex w-max">
          <div className="flex h-screen w-screen shrink-0 items-center justify-center">
            <PreventionSection />
          </div>
          <div className="flex h-screen w-screen shrink-0 items-center justify-center">
            <ChemistryComparison />
          </div>
          <div className="flex h-screen w-screen shrink-0 items-center justify-center">
            <DetectionSection />
          </div>
          <div className="flex h-screen w-screen shrink-0 items-center justify-center">
            <SolutionsSection />
          </div>
          <div className="flex h-screen w-screen shrink-0 items-center justify-center">
            <StatsStrip />
          </div>
          <div className="flex h-screen w-screen shrink-0 items-center justify-center">
            <GlossarySection />
          </div>
          <div className="flex h-screen w-screen shrink-0 items-center justify-center">
            <QuizSection />
          </div>
        </motion.div>
      </div>
    </section>
  )
}