"use client"

import { AnimatePresence, motion } from "motion/react"
import { Search, X } from "lucide-react"
import { useMemo, useState } from "react"

const glossaryTerms = [
  {
    term: "Anode",
    definition:
      "The electrode that hosts lithium during discharge (graphite or metal); where dendrites typically nucleate.",
  },
  {
    term: "Cathode",
    definition:
      "The positive electrode that lithium ions travel toward during discharge, and away from during charging.",
  },
  {
    term: "Electrolyte",
    definition:
      "The liquid, gel, or solid medium that carries lithium ions between the anode and cathode.",
  },
  {
    term: "Separator",
    definition:
      "A thin, porous membrane that physically keeps the electrodes apart while still letting ions pass through.",
  },
  {
    term: "SEI Layer",
    definition:
      "Solid Electrolyte Interphase — a thin passivation film that forms on the anode from electrolyte breakdown, shaping how evenly lithium plates.",
  },
  {
    term: "Thermal Runaway",
    definition:
      "A self-accelerating chain reaction where heat from an internal failure triggers more heat, often ending in fire or explosion.",
  },
  {
    term: "Dendrite",
    definition:
      "A branching, needle-like filament of metallic lithium that forms from uneven plating during charging.",
  },
  {
    term: "Cycle Life",
    definition:
      "The number of charge/discharge cycles a battery can undergo before its usable capacity drops significantly.",
  },
  {
    term: "Energy Density",
    definition:
      "How much energy a battery stores per unit of weight or volume — the main driver of range and runtime.",
  },
]

function highlight(text: string, query: string) {
  if (!query) return text
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-warning/30 text-foreground">
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  )
}

export default function GlossarySection() {
  const [query, setQuery] = useState("")
  const q = query.trim()

  const results = useMemo(
    () =>
      glossaryTerms.filter(
        (g) =>
          g.term.toLowerCase().includes(q.toLowerCase()) ||
          g.definition.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  )

  return (
    <div className="space-y-5">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms, e.g. separator"
          aria-label="Search the glossary"
          className="h-11 w-full rounded-full border border-border bg-card pr-10 pl-10 text-sm text-foreground shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length} {results.length === 1 ? "term" : "terms"} found
      </p>

      <motion.dl layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {results.map((g) => (
            <motion.div
              layout
              key={g.term}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/40"
            >
              <dt className="text-sm font-bold text-foreground">
                {highlight(g.term, q)}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {highlight(g.definition, q)}
              </dd>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.dl>

      {results.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No terms match &ldquo;{q}&rdquo;. Try the chat assistant in the top
          bar for anything else.
        </p>
      )}
    </div>
  )
}