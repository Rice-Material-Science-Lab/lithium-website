"use client"

import { HexGrid, Layout, Hexagon } from "react-hexgrid"
import { useTheme } from "next-themes"
import { useEffect, useState, useCallback, useRef } from "react"

export default function DisplayHexGrid({
  data,
  width,
  height,
  onCellClick,
  carbonSpeciesMap,
  carbonSpeciesColors,
}: {
  data: number[]
  width: number
  height: number
  onCellClick?: (x: number, y: number) => void
  carbonSpeciesMap?: Map<string, number>
  carbonSpeciesColors?: string[]
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const lastInteractedCellRef = useRef<string | null>(null)

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true))
    
    const handleMouseUp = () => {
      lastInteractedCellRef.current = null
    }
    
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchend", handleMouseUp)
    
    return () => {
      cancelAnimationFrame(handle)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchend", handleMouseUp)
    }
  }, [])

  const handleInteraction = useCallback(
    (latX: number, latY: number) => {
      if (!onCellClick) return
      if (latX >= 0 && latY >= 0) {
        const cellId = `${latX},${latY}`
        
        if (lastInteractedCellRef.current !== cellId) {
          lastInteractedCellRef.current = cellId
          onCellClick(latX, latY)
        }
      }
    },
    [onCellClick]
  )

  const safeHeight = width > 0 ? Math.min(height, Math.ceil(data.length / width)) : 0
  const hexagons = []

  for (let y = 0; y < safeHeight; y++) {
    if (y % 2 === 1) {
      const x = -1
      const q = x + Math.ceil(y / 2)
      const r = -y
      hexagons.push({ q, r, s: -q - r, value: 3, latX: -1, latY: -1 })
    }

    for (let x = 0; x < width; x++) {
      const index = y * width + x
      if (index < data.length) {
        const q = x + Math.ceil(y / 2)
        const r = -y
        hexagons.push({ q, r, s: -q - r, value: data[index], latX: x, latY: y })
      }
    }

    if (y % 2 === 0) {
      const x = width
      const q = x + Math.ceil(y / 2)
      const r = -y
      hexagons.push({ q, r, s: -q - r, value: 3, latX: -1, latY: -1 })
    }
  }

  const getColor = (value: number, x: number, y: number) => {
    if (value === 5) {
      if (carbonSpeciesMap && carbonSpeciesColors) {
        const species = carbonSpeciesMap.get(`${x},${y}`)
        if (species !== undefined && carbonSpeciesColors[species]) {
          return carbonSpeciesColors[species]
        }
      }
      return resolvedTheme === "dark" ? "#F87171" : "#DC2626"
    }

    if (resolvedTheme === "dark") {
      switch (value) {
        case 0: return "#18181B"
        case 1: return "#38BDF8"
        case 2: return "#FB923C"
        case 3: return "#52525B"
        case 4: return "#4ADE80"
        default: return "#18181B"
      }
    } else {
      switch (value) {
        case 0: return "#E5E7EB"
        case 1: return "#2563EB"
        case 2: return "#F97316"
        case 3: return "#6B7280"
        case 4: return "#16A34A"
        default: return "#000000"
      }
    }
  }

  const hexSize = 10
  const hexWidth = Math.sqrt(3) * hexSize
  const clipX = -0.5 * hexWidth
  const clipY = -(height - 1) * (1.5 * hexSize) - hexSize * 2
  const clipWidth = (width + 0.5) * hexWidth
  const clipHeight = (height - 1) * (1.5 * hexSize) + 2 * hexSize
  const viewBox = `${clipX} ${clipY} ${clipWidth} ${clipHeight}`

  return mounted ? (
    <div 
      className="flex h-full items-center grow select-none touch-none"
      onDragStart={(e) => e.preventDefault()}
    >
      <HexGrid width="100%" height="100%" viewBox={viewBox}>
        <defs>
          <clipPath id="side-clip">
            <rect x={clipX} y={clipY} width={clipWidth} height={clipHeight} />
          </clipPath>
        </defs>

        <g clipPath="url(#side-clip)">
          <Layout size={{ x: hexSize, y: hexSize }} flat={false} spacing={1} origin={{ x: 0, y: 0 }}>
            {hexagons.map((hex, i) => (
              <Hexagon
                key={`${hex.q}-${hex.r}-${i}`}
                q={hex.q}
                r={hex.r}
                s={hex.s}
                data={{ latX: hex.latX, latY: hex.latY }}
                onClick={
                  onCellClick ? () => handleInteraction(hex.latX, hex.latY) : undefined
                }
                onMouseDown={
                  onCellClick ? () => handleInteraction(hex.latX, hex.latY) : undefined
                }
                onMouseEnter={
                  onCellClick
                    ? (e: React.MouseEvent) => {
                        if (e.buttons === 1) {
                          handleInteraction(hex.latX, hex.latY)
                        }
                      }
                    : undefined
                }
                style={{
                  fill: getColor(hex.value, hex.latX, hex.latY),
                  stroke: "#ffffff",
                  strokeWidth: 0.3,
                  strokeLinejoin: "round",
                  cursor: onCellClick ? "crosshair" : "default",
                }}
              />
            ))}
          </Layout>
        </g>
      </HexGrid>
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <p>Loading...</p>
    </div>
  )
}