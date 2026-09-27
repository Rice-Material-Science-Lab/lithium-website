import { Card } from "@/components/ui/card"
import { Microscope, Atom, Activity, Waves } from "lucide-react"
import { PreventionCard } from "../prevention-card"

const detectionMethods = [
  {
    icon: Microscope,
    text1: "In-Situ Microscopy",
    text2:
      "Optical and electron microscopy image dendrite nucleation and growth in real time inside a live cell.",
  },
  {
    icon: Atom,
    text1: "Neutron Imaging",
    text2:
      "Neutrons are far more sensitive to lithium than X-rays, revealing metal distribution X-ray CT can miss.",
  },
  {
    icon: Activity,
    text1: "Impedance Spectroscopy",
    text2:
      "Tracking how internal resistance shifts over cycles flags the early signs of uneven plating.",
  },
  {
    icon: Waves,
    text1: "Acoustic Emission",
    text2:
      "Dendrite growth and fracture emit faint stress waves that acoustic sensors can pick up non-destructively.",
  },
]

export default function DetectionSection() {
  return (
    <Card className="space-y-4 rounded-2xl p-8 shadow-sm max-w-8/10">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Detection
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          How researchers actually see dendrites
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Dendrites form inside a sealed cell, so studying them takes
          specialized imaging and sensing.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {detectionMethods.map((m) => (
          <PreventionCard key={m.text1} {...m} />
        ))}
      </div>
    </Card>
  )
}