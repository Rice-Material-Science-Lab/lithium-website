import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"

const LIGHT_SRC = "/videos/lithium-dendrites-light.mp4"
const DARK_SRC = "/videos/lithium-dendrites-dark.mp4"

const videoClass =
  "col-start-1 row-start-1 transform-[rotateX(20deg)_rotateY(20deg)] perspective-[1000px] origin-center scale-[1.5]"

export default function DendriteVideos() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = resolvedTheme === "dark"

  const lightRef = useRef<HTMLVideoElement>(null)
  const darkRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(handle)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const sync = () => {
      const active = isDark ? darkRef.current : lightRef.current
      const inactive = isDark ? lightRef.current : darkRef.current
      if (!active || !inactive) return

      const duration = inactive.duration
      let target = active.currentTime
      if (Number.isFinite(duration) && duration > 0) target %= duration

      if (Math.abs(inactive.currentTime - target) > 0.04) {
        inactive.currentTime = target
      }
      if (inactive.paused) inactive.play().catch(() => {})
    }

    sync()
    const id = window.setInterval(sync, 250)
    return () => window.clearInterval(id)
  }, [mounted, isDark])

  if (!mounted) return null

  return (
    <div className="pointer-events-none absolute inset-0 grid h-full w-full">
      <video
        ref={lightRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ opacity: isDark ? 0 : 1 }}
        className={videoClass}
      >
        <source src={LIGHT_SRC} type="video/mp4" />
      </video>
      <video
        ref={darkRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ opacity: isDark ? 1 : 0 }}
        className={videoClass}
      >
        <source src={DARK_SRC} type="video/mp4" />
      </video>
    </div>
  )
}