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
import { TriangleAlertIcon } from "lucide-react"

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
    <>
      <div
        ref={navRef}
        className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-b-accent p-4 text-white"
      >
        <span className="text-2xl font-bold text-primary dark:text-cyan-500">
          Rice University Dendrite Lab
        </span>

        <div className="flex gap-2">
          <NavigationMenu>
            <NavigationMenuList className="flex list-none gap-2 text-foreground">
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => router.refresh()}
                  className={clsx(
                    navigationMenuTriggerStyle(),
                    "cursor-pointer"
                  )}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => router.push("/sim")}
                  className={clsx(
                    navigationMenuTriggerStyle(),
                    "cursor-pointer"
                  )}
                >
                  Sim
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() =>
                    alert("Library is currently a work in progress.")
                  }
                  className={clsx(
                    navigationMenuTriggerStyle(),
                    "cursor-pointer"
                  )}
                >
                  Library
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </div>
      </div>

      <div
        className="flex min-h-svh p-6"
        style={{ paddingTop: `${navHeight + 24}px` }}
      >
        <Card className="w-full flex-row">
          <div className="w-1/2">
            <h2 className="text-xl font-bold text-primary dark:text-cyan-500">
              Overview
            </h2>
            <h1 className="text-2xl font-bold">What are dendrites?</h1>
            <p className="typeset typeset-info m-2 max-w-[33em]">
              Every time a lithium battery charges, lithium ions move to the
              negative electrode and deposit as metal. Under ideal conditions,
              that metal lays down as a smooth, even layer. But under certain
              conditions, the metal instead grows in thin, branching filaments
              called dendrites.
            </p>
          </div>
          <div className="w-1/2">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-500">
              The Risk
            </h2>
            <h1 className="text-2xl font-bold">Why are they dangerous?</h1>
            <div className="m-2 flex flex-col gap-4">
              {" "}
              <Alert className="bg-red-300 border-red-600 dark:bg-red-800 dark:border-red-400">
                <TriangleAlertIcon />
                <AlertTitle>Internal Short Circuits</AlertTitle>
                <AlertDescription className="text-gray-800 dark:text-gray-100">
                  Dendrites grow like tiny metal needles during charging. They
                  slowly spread across the inner battery gap. Eventually, they
                  pierce the protective separator layer. This creates a direct
                  bridge to the cathode. The resulting short circuit instantly
                  kills the battery.
                </AlertDescription>
              </Alert>
              <Alert className="bg-red-300 border-red-600 dark:bg-red-800 dark:border-red-400">
                <TriangleAlertIcon />
                <AlertTitle>Accelerated Capacity Loss</AlertTitle>
                <AlertDescription className="text-gray-800 dark:text-gray-100">
                  Dendrite formation permanently traps active lithium ions.
                  These ions get stuck in the dead structures. They can no
                  longer move to carry charge. This damage rapidly reduces
                  battery energy capacity. Devices suffer a much shorter overall
                  lifespan.
                </AlertDescription>
              </Alert>
              <Alert className="bg-red-300 border-red-600 dark:bg-red-800 dark:border-red-400">
                <TriangleAlertIcon />
                <AlertTitle>Thermal Runaway and Fires</AlertTitle>
                <AlertDescription className="text-gray-800 dark:text-gray-100">
                  Short circuits from dendrites cause massive electrical surges.
                  This sudden rush generates intense internal heat. The extreme
                  temperature ignites flammable liquid electrolytes. This
                  triggers a dangerous chain reaction. The battery can swell,
                  explode, or catch fire.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
