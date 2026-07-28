"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "../theme-provider"
import { Button } from "./button"
import { MessageSquare, Newspaper } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Sim", href: "/sim" },
    { label: "Library", href: "/library", disabled: true },
  ]

  return (
    <nav className="flex w-full items-center justify-between bg-primary px-8 py-4 text-white shadow-lg dark:shadow-[0_6px_24px_rgba(255,255,255,0.12)]">
      <h1 className="text-2xl font-bold tracking-tight font-heading">Dendrite Lab</h1>
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
  )
}
