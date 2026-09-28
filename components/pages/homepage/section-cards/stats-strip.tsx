"use client"

import { animate, useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

const stats = [
  { prefix: "$", value: 5, suffix: "B+", label: "Cost of the Samsung Galaxy Note7 recall" },
  { prefix: "$", value: 2, suffix: "B", label: "Cost of the Chevy Bolt EV battery recall" },
  { prefix: "", value: 18, suffix: "", label: "Deaths from lithium-ion battery fires in New York City in 2023" },
  { prefix: "", value: 6, suffix: " hrs", label: "Burn time of the 2021 Victorian Big Battery fire" },
]

function CountUp({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      const id = requestAnimationFrame(() => setDisplay(value))
      return () => cancelAnimationFrame(id)
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduced, value])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

export default function StatsStrip() {
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4 [&>*]:bg-card">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-2 p-5 sm:p-6">
          <dt className="order-2 text-xs leading-relaxed text-muted-foreground">
            {s.label}
          </dt>
          <dd className="order-1 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  )
}