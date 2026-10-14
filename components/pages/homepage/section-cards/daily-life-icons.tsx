import type { ReactNode } from "react"

/**
 * Redesigned "daily life" icons for the homepage (section 03).
 * One consistent duotone line style: foreground strokes with a brand-blue
 * "electric" accent. Colors come from `currentColor` / theme tokens, so a
 * single SVG adapts to light and dark mode — no separate dark assets needed.
 */

function IconShell({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={5.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden
    >
      {children}
    </svg>
  )
}

export function EbikeIcon() {
  return (
    <IconShell>
      <circle cx="30" cy="66" r="11" />
      <circle cx="66" cy="66" r="11" />
      <path d="M30 66 L44 50 H58" />
      <path d="M44 50 L52 66" />
      <path d="M52 66 L63 43" />
      <path d="M63 43 L66 66" />
      <path d="M59 36 L70 36" />
      <path d="M63 43 L62 36" />
      <path d="M35 44 H45" />
      <path d="M40 44 V50" />
      <circle cx="52" cy="66" r="3" />
    </IconShell>
  )
}

export function ConsumerTechIcon() {
  return (
    <IconShell>
      <rect x="34" y="20" width="28" height="56" rx="9" />
      <path d="M44 29 h8" />
    </IconShell>
  )
}

export function EVehicleIcon() {
  return (
    <IconShell>
      <path d="M12 58 V54 C12 50 15 48 19 47 L32 43 L40 31 C42 28 45 27 49 27 H60 C64 27 67 28 69 31 L76 42 L80 43 C84 44 86 46 86 50 V58" />
      <circle cx="31" cy="62" r="7.5" />
      <circle cx="65" cy="62" r="7.5" />
      <path d="M38.5 62 H57.5" />
    </IconShell>
  )
}

export function AviationIcon() {
  return (
    <IconShell>
      <path d="M48 8 C48 8 42 8 42 15 L42 34 L16 52 C13 54 13 58 16 59 L42 50 L42 66 L30 76 C28 78 29 81 32 80 L48 74 L64 80 C67 81 68 78 66 76 L54 66 L54 50 L80 59 C83 58 83 54 80 52 L54 34 L54 15 C54 8 48 8 48 8 Z" />
    </IconShell>
  )
}
