import Image from "next/image"
import { cn } from "@/lib/utils"

/**
 * Official Rice University preferred mark (public/rice-logo.webp), used
 * unmodified as the Rice brand guide requires (no recolouring or cropping).
 * The file is navy on transparent, so it sits on a white chip with
 * clear-space padding; that keeps it legible on the navy navbar in both
 * light and dark mode. To use the reversed (white) official file instead,
 * drop it in public/ and point `src` at it, then remove the chip styling.
 */
export default function RiceLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-white px-2 py-1.5",
        className
      )}
    >
      <Image
        src="/rice-logo.webp"
        alt="Rice University"
        width={255}
        height={100}
        priority
        className="h-9 w-auto"
      />
    </span>
  )
}
