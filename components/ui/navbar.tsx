"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import RiceLogo from "@/components/ui/rice-logo"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { Newspaper, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useTheme } from "next-themes"
import ChatPanel from "@/components/ui/chat-panel"

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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
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

  const fetchNews = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/news")
      const data = await res.json()
      setNews(data)
      setLastUpdated(new Date())
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    ;(() => fetchNews())()
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [open, fetchNews])

  function handleOpen() {
    setOpen((prev) => !prev)
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon-sm"
        className={`hover:bg-primary-foreground/10 ${open ? "text-primary-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"}`}
        onClick={handleOpen}
        aria-label="Recent news"
      >
        <Newspaper className="h-5 w-5" />
      </Button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-3 flex max-h-130 w-96 max-w-[calc(100vw-1.5rem)] flex-col rounded-2xl border border-border bg-card text-card-foreground">
          <div className="px-5 pt-5 pb-3">
            <p className="text-base font-bold text-foreground">Recent News</p>
            {lastUpdated && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Updated {timeAgo(lastUpdated.toISOString())}
              </p>
            )}
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-3">
            {loading &&
              news.length === 0 &&
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse space-y-2 rounded-xl bg-background/60 p-4"
                >
                  <div className="h-3 w-3/4 rounded bg-muted-foreground/20" />
                  <div className="h-3 w-full rounded bg-muted-foreground/20" />
                  <div className="h-3 w-1/2 rounded bg-muted-foreground/20" />
                </div>
              ))}

            {!loading && news.length === 0 && (
              <p className="px-2 py-4 text-sm text-muted-foreground">
                No news found.
              </p>
            )}

            {news.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block space-y-1 rounded-xl bg-background/60 p-4 transition-colors hover:bg-accent"
              >
                <p className="line-clamp-2 text-sm leading-snug font-medium text-foreground">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {item.source && (
                    <span className="font-medium">{item.source}</span>
                  )}
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
  const isHomePage = pathname === "/"

  const [navBarOpen, setNavbarOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPathname, setMenuPathname] = useState(pathname)

  // Close the mobile menu on navigation (adjusting state during render
  // keeps this in sync without an effect).
  if (menuPathname !== pathname) {
    setMenuPathname(pathname)
    setMenuOpen(false)
  }

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])

  // Homepage only: hide the navbar while scrolling down, show it again
  // as soon as the user starts scrolling up.
  const [navVisible, setNavVisible] = useState(true)

  useEffect(() => {
    if (!isHomePage) return

    const HIDE_THRESHOLD = 100
    const SCROLL_DEAD_ZONE = 5
    let lastScrollY = window.scrollY
    let initialized = false
    let rafId = 0

    function updateVisibility() {
      const currentY = window.scrollY
      // Sync with the scroll position on entry (e.g. back navigation).
      if (!initialized) {
        initialized = true
        lastScrollY = currentY
        setNavVisible(currentY <= HIDE_THRESHOLD)
        return
      }
      const delta = currentY - lastScrollY
      lastScrollY = currentY
      if (currentY <= HIDE_THRESHOLD) {
        setNavVisible(true)
      } else if (delta > SCROLL_DEAD_ZONE) {
        setNavVisible(false)
      } else if (delta < -SCROLL_DEAD_ZONE) {
        setNavVisible(true)
      }
    }

    function onScroll() {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        updateVisibility()
      })
    }

    onScroll()

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [isHomePage])

  const reduceMotion = useReducedMotion()

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Simulator", href: "/sim" },
    { label: "Library", href: "/library" },
    { label: "References", href: "/references" },
    { label: "About", href: "/about" },
  ]

  const { resolvedTheme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(handle)
  }, [])

  return (
    <div className="relative z-50">
      <motion.div
        initial={false}
        animate={{
          y: isSimPage
            ? navBarOpen
              ? 0
              : "calc(-100% + 40px)"
            : isHomePage && !navVisible
              ? "-100%"
              : 0,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 300, damping: 30 }
        }
        className={cn(
          "inset-x-0 top-0 z-50 flex w-full flex-col",
          isSimPage && "items-end",
          // Fixed on the homepage so the bar can slide back into view on
          // scroll-up; absolute everywhere else (unchanged behavior).
          isHomePage ? "fixed" : "absolute"
        )}
      >
        <nav className="z-10 flex w-full items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-md lg:px-8 lg:py-4 dark:shadow-[0_6px_24px_--theme(--color-foreground/6%)]">
          <div className="flex min-w-0 items-center gap-4">
            <a
              href="https://www.rice.edu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="In collaboration with Rice University"
              className="hidden shrink-0 flex-col gap-0.5 text-primary-foreground transition-opacity hover:opacity-80 sm:flex"
            >
              <span className="text-[10px] leading-none font-medium tracking-wide text-primary-foreground/70">
                In collaboration with
              </span>
              <RiceLogo />
            </a>
            <span
              aria-hidden
              className="hidden h-9 w-px bg-primary-foreground/25 sm:block"
            />
            <Link href="/" className="flex min-w-0 flex-col leading-tight">
              <span className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                Battery Dendrites
              </span>
              <span className="hidden text-xs font-medium text-primary-foreground/70 sm:block">
                An educational resource
              </span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-sm font-medium lg:gap-6">
            <div className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href

                return (
                  <Button
                    key={link.href}
                    asChild
                    variant="link"
                    className={
                      isActive
                        ? "font-bold text-primary-foreground underline underline-offset-4"
                        : "text-primary-foreground/70 hover:text-primary-foreground hover:underline"
                    }
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                )
              })}
            </div>

            {mounted && (
              <AnimatedThemeToggler
                theme={resolvedTheme === "dark" ? "dark" : "light"}
                onThemeChange={setTheme}
                variant={"hexagon"}
                duration={600}
              />
            )}

            <div className="hidden items-center gap-6 lg:flex">
              <NewsPanel />
              <ChatPanel />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground transition-colors hover:bg-primary-foreground/10 lg:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="border-t border-primary-foreground/15 bg-primary px-2 pt-2 pb-4 lg:hidden"
          >
            <div className="flex flex-col">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex h-11 items-center rounded-xl px-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-primary-foreground/10 font-bold text-primary-foreground"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
            <div className="mt-2 border-t border-primary-foreground/15 pt-2">
              <div className="flex h-11 items-center justify-between px-3">
                <span className="text-base font-medium text-primary-foreground/80">
                  Recent news
                </span>
                <NewsPanel />
              </div>
              <div className="flex h-11 items-center justify-between px-3">
                <span className="text-base font-medium text-primary-foreground/80">
                  Ask the Lab
                </span>
                <ChatPanel />
              </div>
            </div>
          </div>
        )}

        {isSimPage && (
          <button
            type="button"
            onClick={() => setNavbarOpen((prev) => !prev)}
            aria-label={
              navBarOpen ? "Collapse navigation" : "Expand navigation"
            }
            className="mr-10 flex h-10 w-fit cursor-pointer items-center justify-center rounded-b-2xl bg-primary p-2 focus:outline-none"
          >
            <ChevronDown
              className={`relative z-130 h-6 w-6 text-primary-foreground transition-transform duration-300 ${
                navBarOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        )}
      </motion.div>
    </div>
  )
}