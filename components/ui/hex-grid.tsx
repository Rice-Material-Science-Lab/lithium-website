"use client"

import { HexGrid, Layout, Hexagon } from "react-hexgrid"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function DisplayHexGrid({
  data,
  width,
  height,
}: {
  data: number[]
  width: number
  height: number
}) {
  const { resolvedTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(handle)
  }, [])

  const hexagons = []

  for (let y = 0; y < height; y++) {
    // all of this math is for cubic coords

    // filler hexagons (left)

    if (y % 2 === 1) {
      const x = -1
      const q = x + Math.ceil(y / 2)
      const r = -y
      hexagons.push({ q, r, s: -q - r, value: 3 })
    }

    // real hexagons

    for (let x = 0; x < width; x++) {
      const index = y * width + x

      if (index < data.length) {
        const q = x + Math.ceil(y / 2)
        const r = -y
        hexagons.push({ q, r, s: -q - r, value: data[index] })
      }
    }

    // filler hexagons (right)
    if (y % 2 === 0) {
      const x = width
      const q = x + Math.ceil(y / 2)
      const r = -y
      hexagons.push({ q, r, s: -q - r, value: 3 })
    }
  }

  const getColor = (value: number) => {
    if (resolvedTheme === "dark") {
      switch (value) {
        case 0:
          return "#000000" // black (empty)
        case 1:
          return "#005f78" // blue (free)
        case 2:
          return "#f97316" // orange (deposited)
        case 3:
          return "#374151" // dark gray (substrate)
        case 4:
          return "#22c55e" // green (passivated)
        default:
          return "#000000" // fallback black
      }
    } else {
      switch (value) {
        case 0:
          return "#D1D1D1" // off-white (empty)
        case 1:
          return "#007596" // turquoise (free)
        case 2:
          return "#FF974D" // orange (deposited)
        case 3:
          return "#616161" // dark gray (substrate)
        case 4:
          return "#49E281" // green (passivated)
        default:
          return "#000000" // fallback black
      }
    }
  }

  const hexSize = 10
  const hexWidth = Math.sqrt(3) * hexSize

  // clip path removing half of the side hexagons

  const clipX = -0.5 * hexWidth
  const clipY = -(height - 1) * (1.5 * hexSize) - hexSize * 2
  const clipWidth = (width + 0.5) * hexWidth
  const clipHeight = (height - 1) * (1.5 * hexSize) + 2 * hexSize

  const viewBox = `${clipX} ${clipY} ${clipWidth} ${clipHeight}`

  return (
    mounted ? (
      <div className="flex h-full w-full items-center justify-center">
        <HexGrid width="100%" height="100%" viewBox={viewBox}>
          <defs>
            <clipPath id="side-clip">
              <rect x={clipX} y={clipY} width={clipWidth} height={clipHeight} />
            </clipPath>
          </defs>

          <g clipPath="url(#side-clip)">
            <Layout
              size={{ x: hexSize, y: hexSize }}
              flat={false}
              spacing={1}
              origin={{ x: 0, y: 0 }}
            >
              {hexagons.map((hex, i) => (
                <Hexagon
                  key={`${hex.q}-${hex.r}-${i}`}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  style={{
                    fill: getColor(hex.value),
                    stroke: "#ffffff",
                    strokeWidth: 0.3,
                    strokeLinejoin: "round",
                  }}
                />
              ))}
            </Layout>
          </g>
        </HexGrid>
      </div>
    ) : <div className="w-full h-full flex items-center justify-center"><p>Loading...</p></div>
  )
}
