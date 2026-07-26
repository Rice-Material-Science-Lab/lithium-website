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
import { Separator } from "@/components/ui/separator"
import {
  MdOutlineElectricCar,
  MdOutlineElectricBike,
  MdOutlinePhoneAndroid,
  MdOutlineAirplanemodeActive,
} from "react-icons/md"

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
        <Card className="h-fit w-full flex-col">
          <div className="flex">
            <div className="w-1/2">
              <h2 className="text-xl font-bold text-primary dark:text-cyan-500">
                Overview
              </h2>
              <h1 className="text-2xl font-bold">What are dendrites?</h1>
              <p className="typeset typeset-info m-2 max-w-[50em]">
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
              <div className="m-2 flex max-w-[50em] flex-col gap-4">
                <Alert className="border-red-600 bg-red-300 dark:border-red-400 dark:bg-red-800">
                  <TriangleAlertIcon />
                  <AlertTitle>Internal Short Circuits</AlertTitle>
                  <AlertDescription className="text-gray-800 dark:text-gray-100">
                    Dendrites pierce the protective internal separator to cause
                    fatal battery short circuits.
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-600 bg-red-300 dark:border-red-400 dark:bg-red-800">
                  <TriangleAlertIcon />
                  <AlertTitle>Accelerated Capacity Loss</AlertTitle>
                  <AlertDescription className="text-gray-800 dark:text-gray-100">
                    Dendrites permanently trap lithium ions to drastically
                    reduce the battery lifespan.
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-600 bg-red-300 dark:border-red-400 dark:bg-red-800">
                  <TriangleAlertIcon />
                  <AlertTitle>Thermal Runaway and Fires</AlertTitle>
                  <AlertDescription className="text-gray-800 dark:text-gray-100">
                    Dendrite short circuits spark intense heat that triggers
                    explosive battery fires.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex flex-col items-center">
              <div>
                <h1 className="ml-10 text-2xl font-bold">
                  Where this shows up in daily life
                </h1>
                <p className="typeset typeset-info m-2 max-w-[60em]">
                  Lithium-ion batteries are in nearly everything that holds a
                  charge: phones, laptops, power tools, power banks, e-bikes and
                  scooters, hearing aids, and of course electric vehicles and
                  grid-scale storage.
                </p>
                <div className="flex justify-between my-10">
                  <div className="flex flex-col items-center">
                    <div className="flex aspect-square h-40 w-40 justify-center overflow-hidden">
                      <MdOutlineElectricBike size={160} />
                    </div>
                    <p className="font-bold">E-bikes/scooters</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex aspect-square h-40 w-40 justify-center overflow-hidden">
                      <MdOutlineElectricCar size={160} />
                    </div>
                    <p className="font-bold">E-bikes/scooters</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex aspect-square h-40 w-40 justify-center overflow-hidden">
                      <MdOutlinePhoneAndroid size={160} />
                    </div>
                    <p className="font-bold">E-bikes/scooters</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex aspect-square h-40 w-40 justify-center overflow-hidden">
                      <MdOutlineAirplanemodeActive size={160} />
                    </div>
                    <p className="font-bold">E-bikes/scooters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
