"use client"

import { FileDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { printSection } from "@/lib/print"

/**
 * Opens the browser's print dialog for one section, where visitors can choose
 * "Save as PDF". Point `targetId` at the element to save.
 */
export function SavePdfButton({
  targetId,
  fileName,
  label = "Save as PDF",
  className,
  variant = "outline",
}: {
  targetId: string
  fileName: string
  label?: string
  className?: string
  variant?: "outline" | "onBrand"
}) {
  return (
    <button
      type="button"
      onClick={() => {
        const el = document.getElementById(targetId)
        if (el) printSection(el, fileName)
      }}
      className={cn(
        "print-hide inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
        variant === "outline" &&
          "border-border bg-background/60 text-foreground/80 hover:border-brand/40 hover:text-foreground",
        variant === "onBrand" &&
          "border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10",
        className
      )}
    >
      <FileDown className="h-4 w-4" />
      {label}
    </button>
  )
}
