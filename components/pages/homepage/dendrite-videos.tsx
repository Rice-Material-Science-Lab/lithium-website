import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export default function DendriteVideos() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(handle)
  }, [])

  if (!mounted) return null

  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full">
      <video
        key={
          isDark
            ? "/videos/lithium-dendrites-dark.mp4"
            : "/videos/lithium-dendrites-light.mp4"
        }
        autoPlay
        loop
        muted
        playsInline
        className="transform-[rotateX(20deg)_rotateY(20deg)] perspective-[1000px] origin-center scale-[1.5]"
      >
        <source
          src={
            isDark
              ? "/videos/lithium-dendrites-dark.mp4"
              : "/videos/lithium-dendrites-light.mp4"
          }
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
