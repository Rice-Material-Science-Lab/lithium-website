import { Scan, Microscope, Snowflake, Eye } from "lucide-react"
import { PreventionCard } from "../prevention-card"

const detectionMethods = [
  {
    icon: Scan,
    text1: "X-ray Tomography (CT)",
    text2:
      "Like a hospital CT scan for batteries. Powerful X-rays build a 3D picture of a sealed cell, showing where dendrites grow and when they reach the separator, all without opening it.",
  },
  {
    icon: Microscope,
    text1: "Scanning Electron Microscopy (SEM)",
    text2:
      "A focused electron beam images the anode surface in fine detail, showing whether the lithium formed a smooth layer, a mossy mat, or sharp needles.",
  },
  {
    icon: Snowflake,
    text1: "Cryo-Electron Microscopy",
    text2:
      "Lithium is so delicate that an electron beam can damage it. Freezing the sample first protects it, so researchers can image dendrites down to individual rows of atoms.",
  },
  {
    icon: Eye,
    text1: "In-Situ Optical Microscopy",
    text2:
      "Cells built with a see-through window let researchers watch dendrites sprout and branch live, while the battery is charging.",
  },
]

export default function DetectionSection() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {detectionMethods.map((m) => (
        <PreventionCard key={m.text1} {...m} />
      ))}
    </div>
  )
}