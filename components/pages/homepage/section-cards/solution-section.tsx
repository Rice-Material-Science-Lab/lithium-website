import { Card } from "@/components/ui/card"
import { Layers, ShieldCheck, Timer, BrainCircuit } from "lucide-react"
import { PreventionCard } from "../prevention-card"

const solutions = [
  {
    icon: Layers,
    text1: "Solid Electrolytes",
    text2:
      "A rigid electrolyte can physically resist penetration in a way liquid electrolytes can't.",
  },
  {
    icon: ShieldCheck,
    text1: "Artificial SEI Coatings",
    text2:
      "Engineered protective layers promote a smoother, more uniform flow of lithium ions.",
  },
  {
    icon: Timer,
    text1: "Pulse Charging",
    text2:
      "Alternating charge and rest pulses give ions time to settle evenly instead of piling up.",
  },
  {
    icon: BrainCircuit,
    text1: "Smart Battery Management",
    text2:
      "ML-driven battery management systems adjust current in real time based on temperature and impedance.",
  },
]

export default function SolutionsSection() {
  return (
    <Card className="max-w-8/10 space-y-4 rounded-2xl p-8 shadow-sm">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Engineering
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          What&apos;s being done about it
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          None of these fully solve dendrite growth on their own — most products
          combine several.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {solutions.map((s) => (
          <PreventionCard key={s.text1} {...s} />
        ))}
      </div>
    </Card>
  )
}