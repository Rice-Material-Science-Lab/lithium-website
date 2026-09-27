import { Card } from "@/components/ui/card"

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


export default function GlossarySection() {
  return (
    <Card className="space-y-4 rounded-2xl p-8 shadow-sm max-w-8/10">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Reference
        </p>
        <h2 className="text-2xl font-bold text-foreground">Glossary</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The vocabulary you&apos;ll run into throughout this site.
        </p>
      </div>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {glossaryTerms.map((g) => (
          <div key={g.term} className="rounded-xl border border-border p-4">
            <dt className="text-sm font-bold text-foreground">{g.term}</dt>
            <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {g.definition}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}