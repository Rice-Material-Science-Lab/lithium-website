"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, type MouseEvent, type ReactNode } from "react"
import { ArrowRight, ArrowUpRight, Globe, Mail, Plus } from "lucide-react"
import { FaGithub, FaLinkedinIn } from "react-icons/fa"
import { SiGooglescholar } from "react-icons/si"

import { cn } from "@/lib/utils"
import {
  principalInvestigator as pi,
  team,
  type TeamLink,
  type TeamMember,
} from "@/lib/team"
import { Eyebrow, Reveal } from "@/components/pages/homepage/layout-primitives"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


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
          className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[oklch(0.52_0.105_223)] via-[oklch(0.42_0.09_226)] to-[oklch(0.25_0.05_230)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        >
          <div
            className="absolute inset-0 mask-[radial-gradient(80%_70%_at_70%_20%,black,transparent)] opacity-70"
            style={{ backgroundImage: HEX_TILE, backgroundSize: "28px 48.5px" }}
          />
          <div className="absolute -top-1/4 -right-1/4 h-3/4 w-3/4 rounded-full bg-cyan-300/25 blur-3xl" />
          <span className="relative font-heading text-[clamp(3rem,9vw,6rem)] font-bold tracking-tight text-white/90 drop-shadow-[0_2px_24px_rgb(0_0_0/0.25)]">
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
          className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary dark:border-cyan-400/20 dark:bg-cyan-400/5 dark:text-cyan-300"
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
            className="group/link inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 text-sm font-medium text-foreground/80 transition-all hover:border-primary/40 hover:bg-background hover:text-foreground dark:bg-white/3 dark:hover:border-cyan-400/40"
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
  "pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(420px_circle_at_var(--mx)_var(--my),rgb(255_255_255/0.10),transparent_45%)]"



function PrincipalInvestigator() {
  return (
    <section aria-labelledby="pi-name" className="scroll-mt-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_64px_-28px_rgb(0_0_0/0.35)] dark:shadow-none">
          <BorderBeam
            size={180}
            duration={12}
            colorFrom="#22d3ee"
            colorTo="#0e7490"
            borderWidth={1.5}
          />
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="group relative p-3 sm:p-4 lg:pr-0">
              <Portrait
                member={pi}
                priority
                sizes="(min-width: 1024px) 420px, 100vw"
                className="aspect-4/5 h-full max-h-140 w-full rounded-2xl lg:max-h-none"
              />
              <span className="absolute top-7 left-7 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-md sm:top-8 sm:left-8">
                Principal Investigator
              </span>
            </div>

            <div className="flex flex-col justify-center gap-7 p-6 sm:p-10 lg:p-14">
              <div className="space-y-3">
                <Eyebrow index="01">Leading the lab</Eyebrow>
                <h2
                  id="pi-name"
                  className="font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl"
                >
                  {pi.name}
                </h2>
                <p className="text-sm font-medium text-muted-foreground sm:text-base">
                  {pi.title}
                </p>
              </div>

              <figure className="relative border-l-2 border-primary/60 pl-5 dark:border-cyan-400/60">
                <blockquote className="font-heading text-xl leading-snug text-pretty text-foreground/90 italic sm:text-2xl">
                  &ldquo;{pi.statement}&rdquo;
                </blockquote>
              </figure>

              <p className="max-w-prose text-[15px] leading-relaxed text-pretty text-muted-foreground">
                {pi.bio}
              </p>

              <div className="flex flex-col gap-4 border-t border-foreground/10 pt-6">
                <FocusChips items={pi.focus} />
                <LinkRow links={pi.links} />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}


function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const { ref, onMouseMove } = useSpotlight<HTMLButtonElement>()
  const number = String(index + 1).padStart(2, "0")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          ref={ref}
          onMouseMove={onMouseMove}
          type="button"
          aria-label={`Read more about ${member.name}`}
          className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_28px_56px_-28px_rgb(0_0_0/0.45)] focus-visible:ring-2 focus-visible:ring-ring dark:hover:border-cyan-400/40"
        >
          <div aria-hidden className={SPOTLIGHT} />
          <div className="relative">
            <Portrait
              member={member}
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
              className="aspect-4/3 w-full sm:aspect-4/5"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/55 to-transparent" />
            <span className="absolute top-4 left-4 font-mono text-xs font-medium text-white/80">
              {number}
            </span>
            <span className="absolute top-3 right-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <Plus className="h-4 w-4" />
            </span>
            <p className="absolute right-4 bottom-4 left-4 text-[11px] font-semibold tracking-[0.18em] text-white/85 uppercase">
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
            <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-primary dark:text-cyan-400">
              View profile
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Portrait
            member={member}
            sizes="(min-width: 640px) 300px, 100vw"
            className="aspect-16/10 w-full sm:aspect-auto sm:h-full sm:min-h-96"
          />
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div className="space-y-2">
              <Eyebrow index={number}>{member.role}</Eyebrow>
              <DialogTitle className="font-heading text-3xl font-bold tracking-tight text-foreground">
                {member.name}
              </DialogTitle>
              <p className="text-sm font-medium text-foreground/80">
                {member.contribution}
              </p>
            </div>
            <DialogDescription className="text-[15px] leading-relaxed text-pretty text-muted-foreground">
              {member.bio}
            </DialogDescription>
            <FocusChips items={member.focus} />
            <LinkRow
              links={member.links}
              className="mt-auto border-t border-border pt-5"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TeamGrid() {
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
          science writing. Select a card to read more.
        </p>
      </Reveal>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((m, i) => (
          <li key={`${m.name}-${i}`}>
            <Reveal delay={0.08 * i} className="h-full">
              <MemberCard member={m} index={i} />
            </Reveal>
          </li>
        ))}
      </ul>
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
                <span className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary dark:group-hover:text-cyan-400">
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
          className="absolute -top-24 left-1/2 h-64 w-160 -translate-x-1/2 rounded-full bg-cyan-300/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl space-y-6">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            See a dendrite grow for yourself
          </h2>
          <p className="text-pretty text-white/75">
            The simulation is the heart of this project. Change the charging
            conditions and watch the lithium respond.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/sim"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-primary shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Open the simulation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/references"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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
    <div className="relative min-h-screen overflow-x-clip bg-[#dde9f5] font-sans dark:bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-160 bg-[radial-gradient(60%_60%_at_50%_0%,rgb(255_255_255/0.75),transparent_70%)] dark:bg-[radial-gradient(60%_60%_at_50%_0%,rgb(34_211_238/0.09),transparent_70%)]"
      />

      <main className="relative mx-auto max-w-6xl space-y-24 px-4 pt-32 pb-24 sm:space-y-32 sm:px-6 sm:pt-36">
        <Reveal>
          <header className="max-w-3xl space-y-6">
            <Eyebrow>About the lab</Eyebrow>
            <h1 className="font-heading text-5xl leading-[1.04] font-bold tracking-tight text-balance text-foreground sm:text-6xl">
              The people behind{" "}

              {/* writing just "Battery Dendrites" here might sound a bit odd */}
              <span className="text-primary dark:text-cyan-400">
                Battery Dendrites 
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
              We&rsquo;re a small research group at Rice University studying how
              lithium dendrites form, and building tools that make battery
              safety easier to understand.
            </p>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>Rice University</span>
              <span aria-hidden className="opacity-40">
                /
              </span>
              <span>Rice University * Mesoscale Materials Science Group</span>
              <span aria-hidden className="opacity-40">
                /
              </span>
              <span>Houston, Texas</span>
            </p>
          </header>
        </Reveal>

        <PrincipalInvestigator />
        <TeamGrid />
        <Mission />
        <Closing />
      </main>
    </div>
  )
}