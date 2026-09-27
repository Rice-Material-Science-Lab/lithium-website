"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import ChemistryComparison from "./section-cards/chemistry-comparison"
import DetectionSection from "./section-cards/detection-methods"
import SolutionsSection from "./section-cards/solution-section"
import StatsStrip from "./section-cards/stats-strip"
import GlossarySection from "./section-cards/glossary-section"
import QuizSection from "./section-cards/quiz-section"
import PreventionSection from "./section-cards/prevention-section"

export default function HorizontalScrollSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(handle)
  }, [])

  const targetRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-600vw"])

  return (
    mounted && (
      <section ref={targetRef} className="relative h-[700vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
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
  )
}