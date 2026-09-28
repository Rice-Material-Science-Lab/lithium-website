"use client"

import { cn } from "@/lib/utils"
import { motion, useScroll, useSpring } from "motion/react"
import { useEffect, useState } from "react"

export type Chapter = { id: string; label: string }

function useActiveChapter(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-35% 0px -60% 0px" }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r from-primary via-cyan-500 to-amber-400"
    />
  )
}


export function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const [ids] = useState(() => chapters.map((c) => c.id))
  const active = useActiveChapter(ids)
  const activeIndex = chapters.findIndex((c) => c.id === active)

  return (
    <nav
      aria-label="Chapters"
      className="sticky top-28 hidden self-start py-24 lg:block"
    >
      <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        On this page
      </p>
      <ol className="relative space-y-1 border-l border-border">
        {chapters.map((c, i) => {
          const isActive = c.id === active
          const isPast = activeIndex > i
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative -ml-px flex items-baseline gap-2 border-l-2 py-1.5 pl-4 text-sm transition-colors",
                  isActive
                    ? "border-primary font-semibold text-foreground dark:border-cyan-400"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                  isPast && "text-foreground/70"
                )}
              >
                <span className="font-mono text-[11px] tabular-nums opacity-60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}