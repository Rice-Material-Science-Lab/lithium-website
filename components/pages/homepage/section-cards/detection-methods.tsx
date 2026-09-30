import Link from "next/link"
import { ArrowRight, Scan, Microscope, Snowflake, Eye } from "lucide-react"
import { PreventionCard } from "./prevention-card"

const detectionMethods = [
  {
    icon: Scan,
    text1: "X-ray Tomography (CT)",
    href: "/references#xray",
    text2:
      "Like a hospital CT scan for batteries. Powerful X-rays build a 3D picture of a sealed cell, showing where dendrites grow and when they reach the separator, all without opening it.",
  },
  {
    icon: Microscope,
    text1: "Scanning Electron Microscopy (SEM)",
    href: "/references#sem",
    text2:
      "A focused electron beam images the anode surface in fine detail, showing whether the lithium formed a smooth layer, a mossy mat, or sharp needles.",
  },
  {
    icon: Snowflake,
    text1: "Cryo-Electron Microscopy",
    href: "/references#cryo-em",
    text2:
      "Lithium is so delicate that an electron beam can damage it. Freezing the sample first protects it, so researchers can image dendrites down to individual rows of atoms.",
  },
  {
    icon: Eye,
    text1: "In-Situ Optical Microscopy",
    href: "/references#optical-microscopy",
    text2:
      "Cells built with a see-through window let researchers watch dendrites sprout and branch live, while the battery is charging.",
  },
]

export default function DetectionSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {detectionMethods.map((m) => (
          <PreventionCard key={m.text1} {...m} linkLabel="See the research" />
        ))}
      </div>
      <Link
        href="/references"
        className="group flex flex-col gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 transition-colors hover:border-primary/60 hover:bg-primary/10 sm:flex-row sm:items-center sm:justify-between dark:border-cyan-500/30 dark:bg-cyan-500/5 dark:hover:border-cyan-500/60"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">
            Nine techniques, 28 peer-reviewed papers
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            The References page covers these four plus TEM, neutron imaging,
            AFM, impedance spectroscopy, and ultrasound, with links to the
            original studies.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary dark:text-cyan-400">
          Browse all references
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  )
}