"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
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
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          <div>
            <h1 className="text-xl font-medium">
              Lithium Deposition Simulator/Demo
            </h1>
            <p>Everything is a WIP right now.</p>
            <Button onClick={() => router.push("/sim")} className="mt-2">
              Go to sim
            </Button>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </div>
      </div>
    </>
  )
}
