"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Rice University logo that follows the surrounding text colour.
 *
 * Put an official single-colour Rice logo with a transparent background at
 * `public/rice-logo.svg` (download: bit.ly/university-logos, brand.rice.edu).
 * It is drawn as a CSS mask filled with `currentColor`, so it renders white on
 * the navy navbar in both themes (the brand guide's "reversed" usage) and
 * Rice Blue wherever the text colour is Rice Blue. Until the file exists, a
 * text wordmark is shown instead.
 */
const LOGO_SRC = "/rice-logo.svg"

export default function RiceLogo({ className }: { className?: string }) {
  const [hasFile, setHasFile] = useState<boolean | null>(null)

  useEffect(() => {
    let alive = true
    const img = new Image()
    img.onload = () => alive && setHasFile(true)
    img.onerror = () => alive && setHasFile(false)
    img.src = LOGO_SRC
    return () => {
      alive = false
    }
  }, [])

  if (hasFile === false) {
    return (
      <span
        className={cn(
          "font-heading text-lg leading-none font-bold tracking-wide whitespace-nowrap uppercase",
          className
        )}
      >
        Rice University
      </span>
    )
  }

  return (
    <span
      role="img"
      aria-label="Rice University"
      className={cn("block h-8 w-28 bg-current", className)}
      style={{
        maskImage: `url(${LOGO_SRC})`,
        WebkitMaskImage: `url(${LOGO_SRC})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskPosition: "left center",
        WebkitMaskPosition: "left center",
      }}
    />
  )
}
