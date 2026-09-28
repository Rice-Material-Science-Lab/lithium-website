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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {solutions.map((s) => (
        <PreventionCard key={s.text1} {...s} />
      ))}
    </div>
  )
}