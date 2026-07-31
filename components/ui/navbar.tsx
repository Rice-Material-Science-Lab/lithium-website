"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { MessageSquare, Newspaper, ChevronDown } from "lucide-react"
import { ThemeToggle } from "../theme-provider"
import { Button } from "./button"

export default function Navbar() {
  const pathname = usePathname()
  const isSimPage = pathname === "/sim"

  const [navBarOpen, setNavbarOpen] = useState(true)

  useEffect(() => {
    if (isSimPage) {
      return () => setNavbarOpen(false)
    } else {
      return () => setNavbarOpen(true)
    }
  }, [isSimPage])

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Sim", href: "/sim" },
    { label: "Library", href: "/library", disabled: true },
  ]

  return (
    <motion.div
      initial={false}
      animate={{ y: navBarOpen || !isSimPage ? 0 : "calc(-100% + 40px)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={
        isSimPage
          ? "absolute top-0 z-10 flex w-full flex-col items-end"
          : "flex w-full flex-col"
      }
    >
      <nav className="flex w-full items-center justify-between bg-primary px-8 py-4 text-white shadow-lg dark:shadow-[0_6px_24px_rgba(255,255,255,0.12)]">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Dendrite Lab
        </h1>
        <div className="flex items-center gap-6 text-sm font-medium">
          <ThemeToggle className="text-white/70 hover:text-white" />

          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Button
                key={link.href}
                disabled={link.disabled}
                asChild={!link.disabled}
                variant="link"
                className={`${
                  isActive
                    ? "font-bold text-white underline underline-offset-4"
                    : "text-white/70"
                } ${
                  link.disabled
                    ? "cursor-not-allowed opacity-40 hover:no-underline"
                    : "hover:text-white hover:underline"
                }`}
              >
                {link.disabled ? (
                  <span>{link.label}</span>
                ) : (
                  <Link href={link.href}>{link.label}</Link>
                )}
              </Button>
            )
          })}

          <Newspaper className="ml-2 h-5 w-5 text-white/70" />
          <MessageSquare className="h-5 w-5 text-white/70" />
        </div>
      </nav>

      {isSimPage && (
        <button
          type="button"
          onClick={() => setNavbarOpen((prev) => !prev)}
          aria-label={navBarOpen ? "Collapse navigation" : "Expand navigation"}
          className="mr-10 flex h-10 w-fit cursor-pointer items-center justify-center rounded-b-2xl bg-primary p-2 focus:outline-none"
        >
          <ChevronDown
            className={`h-6 w-6 text-white transition-transform duration-300 ${
              navBarOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      )}
    </motion.div>
  )
}