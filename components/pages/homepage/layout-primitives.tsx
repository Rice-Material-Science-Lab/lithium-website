"use client"

import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-16px_rgb(0_0_0/0.18)] sm:p-8 dark:shadow-none",
        className
      )}
    >
      {children}
    </div>
  )
}

export function Eyebrow({
  children,
  index,
  className,
}: {
  children: ReactNode
  index?: string
  className?: string
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-primary uppercase dark:text-cyan-400",
        className
      )}
    >
      {index && (
        <>
          <span className="font-mono tracking-normal">{index}</span>
          <span aria-hidden className="h-px w-8 bg-current opacity-40" />
        </>
      )}
      {children}
    </p>
  )
}


export function SectionShell({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-20 py-16 sm:py-24", className)}
    >
      <Reveal className="mb-8 max-w-3xl sm:mb-12">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <h2
          id={`${id}-title`}
          className="mt-4 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
    </section>
  )
}


export function FeatureCard({
  icon: Icon,
  title,
  children,
  className,
  tone = "primary",
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
  className?: string
  tone?: "primary" | "danger"
}) {
  return (
    <div
      className={cn(
        "group relative flex gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_40px_-20px_rgb(0_0_0/0.35)] dark:hover:border-cyan-500/40",
        tone === "danger" && "hover:border-destructive/40 dark:hover:border-destructive/40",
        className
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
          tone === "primary" &&
            "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground dark:bg-cyan-500/10 dark:text-cyan-400 dark:group-hover:bg-cyan-600 dark:group-hover:text-white",
          tone === "danger" &&
            "bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-white"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}