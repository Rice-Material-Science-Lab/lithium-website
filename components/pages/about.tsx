"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react"
import { ArrowRight, ArrowUpRight, Globe, Mail, Plus, X } from "lucide-react"
import { FaGithub, FaLinkedinIn } from "react-icons/fa"
import { SiGooglescholar } from "react-icons/si"

import { cn } from "@/lib/utils"
import {
  team,
  type TeamLink,
  type TeamMember,
} from "@/lib/team"
import { Eyebrow, Reveal } from "@/components/pages/homepage/layout-primitives"


const LINK_META: Record<
  TeamLink["kind"],
  { label: string; icon: (p: { className?: string }) => ReactNode }
> = {
  email: { label: "Email", icon: (p) => <Mail {...p} /> },
  website: { label: "Website", icon: (p) => <Globe {...p} /> },
  scholar: { label: "Scholar", icon: (p) => <SiGooglescholar {...p} /> },
  linkedin: { label: "LinkedIn", icon: (p) => <FaLinkedinIn {...p} /> },
  github: { label: "GitHub", icon: (p) => <FaGithub {...p} /> },
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
}

/** Faint hexagon lattice — echoes the simulation's hex grid. */
const HEX_TILE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='48.5' viewBox='0 0 28 48.5'><path d='M14 0 28 8.08v16.17L14 32.33 0 24.25V8.08zM14 32.33v16.17' fill='none' stroke='white' stroke-opacity='0.14' stroke-width='1'/></svg>`
)}")`

function Portrait({
  member,
  sizes,
  className,
  priority,
}: {
  member: TeamMember
  sizes: string
  className?: string
  priority?: boolean
}) {
  return (
    <div className={cn("relative overflow-hidden bg-primary", className)}>
      {member.photo ? (
        <Image
          src={member.photo}
          alt={`Portrait of ${member.name}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover grayscale-[0.85] transition-[filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:grayscale-0"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-chart-3 via-primary to-chart-5 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        >
          <div
            className="absolute inset-0 mask-[radial-gradient(80%_70%_at_70%_20%,black,transparent)] opacity-70"
            style={{ backgroundImage: HEX_TILE, backgroundSize: "28px 48.5px" }}
          />
          <div className="absolute -top-1/4 -right-1/4 h-3/4 w-3/4 rounded-full bg-chart-1/25 blur-3xl" />
          <span className="relative font-heading text-[clamp(3rem,9vw,6rem)] font-bold tracking-tight text-primary-foreground/90 drop-shadow-[0_2px_24px_rgb(0_0_0/0.25)]">
            {initials(member.name)}
          </span>
        </div>
      )}
    </div>
  )
}

function FocusChips({
  items,
  className,
}: {
  items?: string[]
  className?: string
}) {
  if (!items?.length) return null
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((f) => (
        <li
          key={f}
          className="rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 text-xs font-medium text-brand"
        >
          {f}
        </li>
      ))}
    </ul>
  )
}

function LinkRow({
  links,
  className,
}: {
  links?: TeamLink[]
  className?: string
}) {
  if (!links?.length) return null
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {links.map((l) => {
        const meta = LINK_META[l.kind]
        const external = l.kind !== "email"
        return (
          <a
            key={l.href}
            href={l.href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group/link inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 text-sm font-medium text-foreground/80 transition-all hover:border-brand/40 hover:bg-background hover:text-foreground dark:bg-foreground/3"
          >
            {meta.icon({ className: "h-3.5 w-3.5" })}
            {meta.label}
            {external && (
              <ArrowUpRight className="h-3 w-3 opacity-40 transition-all group-hover/link:translate-x-px group-hover/link:-translate-y-px group-hover/link:opacity-80" />
            )}
          </a>
        )
      })}
    </div>
  )
}

function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const onMouseMove = (e: MouseEvent<T>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  return { ref, onMouseMove }
}

const SPOTLIGHT =
  "pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(420px_circle_at_var(--mx)_var(--my),color-mix(in_srgb,var(--overlay-foreground)_10%,transparent),transparent_45%)]"



function MemberCard({
  member,
  index,
  open,
  onToggle,
}: {
  member: TeamMember
  index: number
  open: boolean
  onToggle: () => void
}) {
  const { ref, onMouseMove } = useSpotlight<HTMLButtonElement>()
  const number = String(index + 1).padStart(2, "0")

  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      onClick={onToggle}
      type="button"
      aria-expanded={open}
      aria-controls="team-member-panel"
      aria-label={`${open ? "Hide" : "Show"} profile for ${member.name}`}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-card text-left shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none hover:-translate-y-1 hover:shadow-[0_28px_56px_-28px_rgb(0_0_0/0.45)] focus-visible:ring-2 focus-visible:ring-ring",
        open
          ? "-translate-y-1 border-brand ring-2 ring-brand/30"
          : "border-border hover:border-brand/40"
      )}
    >
      <div aria-hidden className={SPOTLIGHT} />
      <div className="relative">
        <Portrait
          member={member}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
          className="aspect-4/3 w-full sm:aspect-4/5"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-overlay/55 to-transparent" />
        <span className="absolute top-4 left-4 font-mono text-xs font-medium text-overlay-foreground/80">
          {number}
        </span>
        <span
          className={cn(
            "absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-overlay-foreground/25 bg-overlay-foreground/15 text-overlay-foreground backdrop-blur-md transition-all duration-500",
            open
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          )}
        >
          <Plus
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              open && "rotate-45"
            )}
          />
        </span>
        <p className="absolute right-4 bottom-4 left-4 text-[11px] font-semibold tracking-[0.18em] text-overlay-foreground/85 uppercase">
          {member.role}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
          {member.name}
        </h3>
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {member.contribution}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-brand">
          {open ? "Hide profile" : "View profile"}
          <ArrowRight
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300",
              open ? "rotate-90" : "group-hover:translate-x-1"
            )}
          />
        </span>
      </div>
    </button>
  )
}

function MemberPanel({
  member,
  index,
  onClose,
}: {
  member: TeamMember
  index: number
  onClose: () => void
}) {
  const number = String(index + 1).padStart(2, "0")
  return (
    <div className="relative grid overflow-hidden rounded-3xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_64px_-28px_rgb(0_0_0/0.35)] sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] dark:shadow-none">
      <Portrait
        member={member}
        sizes="(min-width: 640px) 360px, 100vw"
        className="aspect-16/10 w-full sm:aspect-auto sm:h-full sm:min-h-96"
      />
      <div className="flex flex-col gap-5 p-6 sm:p-10">
        <div className="space-y-2 pr-10">
          <Eyebrow index={number}>{member.role}</Eyebrow>
          <h3 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {member.name}
          </h3>
          <p className="text-sm font-medium text-foreground/80">
            {member.contribution}
          </p>
        </div>
        <div className="space-y-4 text-[15px] leading-relaxed text-pretty text-muted-foreground">
          {member.bio.split(/\n\s*\n/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <FocusChips items={member.focus} />
        <LinkRow
          links={member.links}
          className="mt-auto border-t border-border pt-5"
        />
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${member.name}'s profile`}
        className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function TeamGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Bring the expanded profile into view and allow Escape to close it.
  useEffect(() => {
    if (openIndex === null) return
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [openIndex])

  const open = openIndex === null ? null : team[openIndex]

  return (
    <section aria-labelledby="team-title" className="scroll-mt-24">
      <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-4">
          <Eyebrow index="02">The team</Eyebrow>
          <h2
            id="team-title"
            className="font-heading text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl"
          >
            Students who built this
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Student researchers working across simulation, design, and
          science writing. Select a profile to read more.
        </p>
      </Reveal>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((m, i) => (
          <li key={`${m.name}-${i}`}>
            <Reveal delay={0.08 * i} className="h-full">
              <MemberCard
                member={m}
                index={i}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </Reveal>
          </li>
        ))}
      </ul>

      <div
        id="team-member-panel"
        ref={panelRef}
        role="region"
        aria-label={open ? `${open.name} profile` : undefined}
        className={cn(
          "grid scroll-mt-28 transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "mt-6 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          {open && openIndex !== null && (
            <MemberPanel
              key={openIndex}
              member={open}
              index={openIndex}
              onClose={() => setOpenIndex(null)}
            />
          )}
        </div>
      </div>
    </section>
  )
}

function MissionStatement() {
  return (
    <section aria-labelledby="mission-statement-title" className="scroll-mt-24">
      <Reveal className="space-y-6">
        <Eyebrow index="01">Our mission</Eyebrow>
        <h2 id="mission-statement-title" className="sr-only">
          Mission statement
        </h2>
        {/* Mission statement placeholder: replace this block with the final text. */}
        <div className="flex min-h-40 items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/40 p-8 text-center">
          <p className="max-w-md text-sm text-muted-foreground">
            Mission statement coming soon.
          </p>
        </div>
      </Reveal>
    </section>
  )
}


const PILLARS = [
  {
    k: "Simulate",
    v: "Model how lithium deposits atom by atom, so dendrite growth can be visualized for the public.",
  },
  {
    k: "Educate",
    v: "We want to inform the public about the dangers of dendrite growth to lead to a more sustainable and safe future.",
  },
  {
    k: "Prevent",
    v: "Point to the habits, designs, and materials that keep batteries from failing.",
  },
]

function Mission() {
  return (
    <section aria-labelledby="mission-title" className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal className="space-y-4">
          <Eyebrow index="03">Why we built this</Eyebrow>
          <h2
            id="mission-title"
            className="font-heading text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl"
          >
            Battery failure is dangerous. We want people to see it coming.
          </h2>
        </Reveal>
        <ol className="divide-y divide-foreground/10 border-y border-foreground/10">
          {PILLARS.map((p, i) => (
            <li key={p.k}>
              <Reveal
                delay={0.06 * i}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 py-6 sm:grid-cols-[3rem_9rem_minmax(0,1fr)]"
              >
                <span className="pt-1.5 font-mono text-xs text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-brand">
                  {p.k}
                </span>
                <p className="col-start-2 text-[15px] leading-relaxed text-muted-foreground sm:col-start-3">
                  {p.v}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <Reveal>
      <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="absolute inset-0 mask-[radial-gradient(70%_80%_at_50%_0%,black,transparent)] opacity-60"
          style={{ backgroundImage: HEX_TILE, backgroundSize: "28px 48.5px" }}
        />
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 h-64 w-160 -translate-x-1/2 rounded-full bg-chart-1/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl space-y-6">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            See a dendrite grow for yourself
          </h2>
          <p className="text-pretty text-primary-foreground/75">
            The simulation is the heart of this project. Change the charging
            conditions and watch the lithium respond.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/sim"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-primary-foreground px-6 text-sm font-semibold text-primary shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Open the simulation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/references"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-primary-foreground/30 px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Browse our sources
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  )
}


export default function AboutClientView() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background font-sans">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-160 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_srgb,var(--card)_75%,transparent),transparent_70%)] dark:bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_srgb,var(--brand)_9%,transparent),transparent_70%)]"
      />

      <main className="relative mx-auto max-w-6xl space-y-24 px-4 pt-32 pb-24 sm:space-y-32 sm:px-6 sm:pt-36">
        <Reveal>
          <header className="max-w-3xl space-y-6">
            <Eyebrow>About the team</Eyebrow>
            <h1 className="font-heading text-5xl leading-[1.04] font-bold tracking-tight text-balance text-foreground sm:text-6xl">
              The people behind{" "}

              {/* writing just "Battery Dendrites" here might sound a bit odd */}
              <span className="text-brand">
                Battery Dendrites 
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
              We&rsquo;re a small team of student researchers studying how
              lithium dendrites form and building tools that make battery
              safety easier to understand, in collaboration with Professor
              Ming Tang&rsquo;s Mesoscale Materials Science Group at Rice
              University.
            </p>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>Student research team</span>
              <span aria-hidden className="opacity-40">
                /
              </span>
              <span>
                In collaboration with Prof. Ming Tang, Mesoscale Materials
                Science Group, Rice University
              </span>
            </p>
          </header>
        </Reveal>

        <MissionStatement />
        <TeamGrid />
        <Mission />
        <Closing />
      </main>
    </div>
  )
}