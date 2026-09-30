import { ArrowDown, ArrowRight } from "lucide-react"
import { useReducedMotion, motion } from "motion/react"
import DendriteVideos from "./dendrite-videos"
import { Eyebrow } from "../layout-primitives"
import { Highlighter } from "@/components/ui/highlighter"
import Link from "next/link"

const HERO_MASK =
  "linear-gradient(to bottom, white 0%, white 70%, transparent 100%), linear-gradient(to left, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.3) 100%)"

export default function Hero() {
  const reduced = useReducedMotion()
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.8,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        }

  return (
    <header className="relative h-svh min-h-160 w-full max-w-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: HERO_MASK,
          maskComposite: "intersect",
          WebkitMaskImage: HERO_MASK,
          WebkitMaskComposite: "source-in",
        }}
      >
        {/* <HexagonPattern
          gap={10}
          radius={30}
          color={isDark ? "oklch(1 0 0 / 10%)" : "#727272"}
          className={cn(
            "absolute inset-0",
            "origin-center scale-[1.5]",
            "transform-[rotateX(20deg)_rotateY(20deg)] perspective-[1000px]"
          )}
          colored={30}
        /> */}
        <DendriteVideos />
      </div>
      {/* soft wash so the text always has contrast over the hexagons */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background"
      />

      <div className="relative z-10 flex h-full items-center px-6 pt-20 sm:px-20">
        <div className="flex max-w-3xl flex-col gap-6">
          <motion.div {...rise(0)}>
            <Eyebrow>Rice University · Materials Science Lab</Eyebrow>
          </motion.div>
          <motion.h1
            {...rise(0.1)}
            className="relative text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl md:text-7xl"
          >
            Solving{" "}
            <Highlighter action="underline" color="var(--color-destructive)">
              Dendrites
            </Highlighter>
          </motion.h1>
          <motion.p
            {...rise(0.2)}
            className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl"
          >
            An interactive guide to why lithium-ion batteries fail, what grows
            inside them, and how researchers are working to stop it.
          </motion.p>
          <motion.div
            {...rise(0.3)}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#basics"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 dark:bg-cyan-600"
            >
              Start learning
              <ArrowDown className="h-4 w-4" />
            </a>
            <Link
              href="/sim"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card/80 px-6 text-sm font-semibold text-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-card"
            >
              Open the simulator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#basics"
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 z-10 flex h-10 w-6 -translate-x-1/2 justify-center rounded-full border-2 border-foreground/25 pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.span
          className="h-2 w-1 rounded-full bg-foreground/50"
          animate={reduced ? {} : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.a>
    </header>
  )
}
