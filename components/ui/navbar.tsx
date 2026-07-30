"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { MessageSquare, Newspaper, ChevronDown } from "lucide-react"
import { ThemeToggle } from "../theme-provider"
import { Button } from "./button"

interface NewsItem {
  title: string
  link: string
  pubDate: string
  source: string
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function NewsPanel() {
  const [open, setOpen] = useState(false)
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleOpen() {
    setOpen((prev) => !prev)
    if (!fetched) {
      setLoading(true)
      try {
        const res = await fetch("/api/news")
        const data = await res.json()
        setNews(data)
      } catch {
        setNews([])
      } finally {
        setLoading(false)
        setFetched(true)
      }
    }
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon-sm"
        className={`hover:bg-white/10 ${open ? "text-white" : "text-white/70 hover:text-white"}`}
        onClick={handleOpen}
      >
        <Newspaper className="h-5 w-5" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-96 rounded-2xl border border-border bg-card text-card-foreground shadow-xl z-50 flex flex-col max-h-[520px]">
          <div className="px-5 pt-5 pb-3">
            <p className="text-base font-bold text-foreground">Recent News</p>
          </div>

          <div className="overflow-y-auto flex-1 px-3 pb-3 space-y-2">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-muted p-4 space-y-2 animate-pulse">
                  <div className="h-3 w-3/4 rounded bg-muted-foreground/20" />
                  <div className="h-3 w-full rounded bg-muted-foreground/20" />
                  <div className="h-3 w-1/2 rounded bg-muted-foreground/20" />
                </div>
              ))}

            {!loading && news.length === 0 && (
              <p className="text-sm text-muted-foreground px-2 py-4">No news found.</p>
            )}

            {!loading &&
              news.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-muted hover:bg-accent transition-colors p-4 space-y-1"
                >
                  <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {item.source && <span className="font-medium">{item.source}</span>}
                    {item.source && item.pubDate && <span>·</span>}
                    {item.pubDate && <span>{timeAgo(item.pubDate)}</span>}
                  </div>
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const isSimPage = pathname === "/sim"

  const [navBarOpen, setNavbarOpen] = useState(true)

  useEffect(() => {
    if (isSimPage) {
      setNavbarOpen(false)
    } else {
      setNavbarOpen(true)
    }
  }, [isSimPage])

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Sim", href: "/sim" },
    { label: "Library", href: "/library" },
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
        <h1 className="font-heading text-2xl font-bold tracking-tight">Dendrite Lab</h1>
        <div className="flex items-center gap-6 text-sm font-medium">
          <ThemeToggle className="text-white/70 hover:text-white" />

          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Button
                key={link.href}
                asChild
                variant="link"
                className={
                  isActive
                    ? "font-bold text-white underline underline-offset-4"
                    : "text-white/70 hover:text-white hover:underline"
                }
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            )
          })}

          <NewsPanel />
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
