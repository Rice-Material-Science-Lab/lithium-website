"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import clsx from "clsx"
import { ThemeToggle } from "@/components/theme-provider"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlert, Newspaper, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

function RiskCard({ text1, text2 }: { text1:string, text2: string }) {
  return (
    <div className="flex items-center gap-3 bg-red-100 border border-red-200 rounded-xl px-4 py-3">
      <div className="flex-shrink-0 w-8 h-8 bg-red-300 rounded-lg flex items-center justify-center">
        <TriangleAlert className="w-4 h-4 text-red-600" />
      </div>
      <div>
        <p className="font-semibold text-sm text-gray-800">{text1}</p>
        <p className="text-xs text-red-600">{text2}</p>
      </div>
    </div>
  )
}

export default function Page() {
  const router = useRouter()

  const navRef = useRef<HTMLDivElement>(null)
  const [navHeight, setNavHeight] = useState(0)

  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight)
      }
    }

    updateHeight()

    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  return (
  <div className="min-h-screen bg-[#dde9f5] font-sans">
    <nav className="bg-[#3a6e8c] text-white px-8 py-4 flex items-center justify-between">
      <span className="text-xl font-bold tracking-tight">Dendrite Lab</span>
      <div className="flex items-center gap-6 text-sm font-medium">
        <ThemeToggle className="text-white/70 hover:text-white" />
        <Button variant="link" className="text-white/70 hover:text-white font-bold underline underline-offset-4">Home</Button>
        <Button variant="link" className="text-white/70 hover:text-white" onClick={() => router.push("/sim")}>Sim</Button>
        <Button variant="link" className="text-white/70 hover:text-white">Library</Button>
        <Newspaper className="w-5 h-5 text-white/70 ml-2" />
        <MessageSquare className="w-5 h-5 text-white/70" />
      </div>
    </nav>

    <main className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="bg-white/80 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#3a6e8c] uppercase mb-1">Overview</p>
            <h2 className="text-2xl font-bold text-gray-900">What are dendrites?</h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Every time a lithium battery charges, lithium ions move to the negative electrode and deposit as metal. Under ideal conditions, that metal lays down as a smooth, even layer.
            But under certain conditions, the metal instead grows in thin, branching filaments called dendrites.
          </p>
          <div className="bg-[#3a6e8c] rounded-2xl flex items-center justify-center h-40">
            <p className="text-white font-semibold text-center leading-snug">later insert vid sim</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-red-500 uppercase mb-1">The Risk</p>
            <h2 className="text-2xl font-bold text-gray-900">Why are they dangerous?</h2>
          </div>
          <div className="space-y-3">
            <RiskCard text1="Short Circuits" text2="Dendrites pierce the protective internal separator to cause fatal battery short circuits." />
            <RiskCard text1="Accelerated Capacity Loss" text2="Dendrites permanently trap lithium ions to drastically reduce the battery lifespan." />
            <RiskCard text1="Thermal Runaway and Fires" text2="Dendrite short circuits spark intense heat that triggers explosive battery fires." />
          </div>
        </div>
        <div className="col-span-2">
          <h2 className="text-2xl font-bold text-gray-900">Where this shows up in daily life</h2>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            Lithium-ion batteries are in nearly everything that holds a charge: phones, laptops, power tools, power banks, e-bikes and scooters, hearing aids, and of course
             electric vehicles and grid-scale storage.
          </p>
        </div>
        </div> 


      <div className="bg-white/80 rounded-2xl p-8 shadow-sm">

      </div>
    </main>
  </div>
)
}
