"use client"

import { Card } from "@/components/ui/card"
import { TriangleAlert } from "lucide-react"
import Navbar from "@/components/ui/navbar"

function RiskCard({ text1, text2 }: { text1: string; text2: string }) {
  return (
    <Card className="flex flex-row items-center gap-3 border border-destructive bg-red-100 px-4 py-3 dark:bg-red-600/60">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/60 dark:bg-red-500/60">
        <TriangleAlert className="h-4 w-4 text-destructive" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground/90">{text1}</p>
        <p className="text-sm text-destructive">{text2}</p>
      </div>
    </Card>
  )
}

export default function Page() {

  return (
    <div className="min-h-screen bg-[#dde9f5] font-sans dark:bg-background">
      <Navbar />

      <main className="mx-auto h-full max-w-5xl space-y-6 p-6">
        <Card className="grid grid-cols-1 gap-10 rounded-2xl bg-card p-8 shadow-sm md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
                Overview
              </p>
              <h2 className="text-2xl font-bold text-foreground">
                What are dendrites?
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every time a lithium battery charges, lithium ions move to the
              negative electrode and deposit as metal. Under ideal conditions,
              that metal lays down as a smooth, even layer. But under certain
              conditions, the metal instead grows in thin, branching filaments
              called dendrites.
            </p>
            <div className="flex h-40 items-center justify-center rounded-2xl bg-primary">
              <p className="text-center leading-snug font-semibold text-white">
                Sim coming soon!
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-bold tracking-widest text-destructive uppercase">
                The Risk
              </p>
              <h2 className="text-2xl font-bold text-foreground">
                Why are they dangerous?
              </h2>
            </div>
            <div className="space-y-3">
              <RiskCard
                text1="Short Circuits"
                text2="Dendrites pierce the protective internal separator to cause fatal battery short circuits."
              />
              <RiskCard
                text1="Accelerated Capacity Loss"
                text2="Dendrites permanently trap lithium ions to drastically reduce the battery lifespan."
              />
              <RiskCard
                text1="Thermal Runaway and Fires"
                text2="Dendrite short circuits spark intense heat that triggers explosive battery fires."
              />
            </div>
          </div>
          <div className="col-span-2">
            <h2 className="text-2xl font-bold">
              Where this shows up in daily life
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Lithium-ion batteries are in nearly everything that holds a
              charge: phones, laptops, power tools, power banks, e-bikes and
              scooters, hearing aids, and of course electric vehicles and
              grid-scale storage.
            </p>
          </div>
        </Card>

        <Card className="rounded-2xl bg-card p-8 shadow-sm"></Card>
      </main>
    </div>
  )
}
