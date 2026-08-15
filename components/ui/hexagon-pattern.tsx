/* eslint-disable @typescript-eslint/no-explicit-any */
import { useId, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface HexagonPatternProps extends React.SVGProps<SVGSVGElement> {
  radius?: number
  gap?: number
  x?: number
  y?: number
  direction?: "horizontal" | "vertical"
  strokeDasharray?: string
  className?: string
  color?: string
  [key: string]: unknown
}

type HexPoint = readonly [number, number]

function hexVertexList(
  cx: number,
  cy: number,
  r: number,
  direction: "horizontal" | "vertical"
): HexPoint[] {
  const startAngle = direction === "horizontal" ? 0 : 30
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((startAngle + i * 60) * Math.PI) / 180
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const
  })
}

function hexPoints(
  cx: number,
  cy: number,
  r: number,
  direction: "horizontal" | "vertical"
): string {
  return hexVertexList(cx, cy, r, direction)
    .map(([px, py]) => `${px},${py}`)
    .join(" ")
}

function edgeLexKey(a: HexPoint, b: HexPoint): string {
  const [p, q] =
    a[0] < b[0] || (a[0] === b[0] && a[1] <= b[1]) ? [a, b] : [b, a]
  return `${p[0].toFixed(6)},${p[1].toFixed(6)}|${q[0].toFixed(
    6
  )},${q[1].toFixed(6)}`
}

function collectUniqueHexEdges(
  centers: [number, number][],
  r: number,
  direction: "horizontal" | "vertical"
): [HexPoint, HexPoint][] {
  const seen = new Set<string>()
  const edges: [HexPoint, HexPoint][] = []
  for (const [cx, cy] of centers) {
    const verts = hexVertexList(cx, cy, r, direction)
    for (let i = 0; i < 6; i++) {
      const a = verts[i]
      const b = verts[(i + 1) % 6]
      const key = edgeLexKey(a, b)
      if (!seen.has(key)) {
        seen.add(key)
        edges.push([a, b])
      }
    }
  }
  return edges
}

function isSolidStrokeDasharray(strokeDasharray: string): boolean {
  const t = strokeDasharray.trim()
  return t === "" || t === "none" || t === "0"
}

function getHexSpacing(
  r: number,
  direction: "horizontal" | "vertical",
  gap: number
): {
  colStep: number
  rowStep: number
  tileW: number
  tileH: number
} {
  const sqrt3 = Math.sqrt(3)

  if (direction === "horizontal") {
    const colStep = (3 * r) / 2 + (sqrt3 * gap) / 2
    const rowStep = sqrt3 * r + gap

    return {
      colStep,
      rowStep,
      tileW: colStep * 2,
      tileH: rowStep,
    }
  }

  const colStep = sqrt3 * r + gap
  const rowStep = (3 * r) / 2 + (sqrt3 * gap) / 2

  return {
    colStep,
    rowStep,
    tileW: colStep,
    tileH: rowStep * 2,
  }
}

function getTileGeometry(
  r: number,
  direction: "horizontal" | "vertical",
  gap: number
): {
  tileW: number
  tileH: number
  centers: [number, number][]
} {
  if (direction === "horizontal") {
    const { colStep, rowStep, tileW, tileH } = getHexSpacing(r, direction, gap)

    const canonical: [number, number][] = [
      [colStep / 2, rowStep / 2],
      [(colStep * 3) / 2, rowStep],
    ]

    const centers: [number, number][] = []
    for (const [cx, cy] of canonical) {
      centers.push([cx, cy])
      if (cy - r < 0) centers.push([cx, cy + tileH])
      if (cy + r > tileH) centers.push([cx, cy - tileH])
      if (cx - r < 0) centers.push([cx + tileW, cy])
      if (cx + r > tileW) centers.push([cx - tileW, cy])
      if (cy - r < 0 && cx - r < 0) centers.push([cx + tileW, cy + tileH])
      if (cy - r < 0 && cx + r > tileW) centers.push([cx - tileW, cy + tileH])
      if (cy + r > tileH && cx - r < 0) centers.push([cx + tileW, cy - tileH])
      if (cy + r > tileH && cx + r > tileW)
        centers.push([cx - tileW, cy - tileH])
    }

    return { tileW, tileH, centers }
  } else {
    const { colStep, rowStep, tileW, tileH } = getHexSpacing(r, direction, gap)

    const canonical: [number, number][] = [
      [colStep / 2, rowStep / 2],
      [colStep, (rowStep * 3) / 2],
    ]

    const centers: [number, number][] = []
    for (const [cx, cy] of canonical) {
      centers.push([cx, cy])
      if (cy - r < 0) centers.push([cx, cy + tileH])
      if (cy + r > tileH) centers.push([cx, cy - tileH])
      if (cx - r < 0) centers.push([cx + tileW, cy])
      if (cx + r > tileW) centers.push([cx - tileW, cy])
      if (cy - r < 0 && cx - r < 0) centers.push([cx + tileW, cy + tileH])
      if (cy - r < 0 && cx + r > tileW) centers.push([cx - tileW, cy + tileH])
      if (cy + r > tileH && cx - r < 0) centers.push([cx + tileW, cy - tileH])
      if (cy + r > tileH && cx + r > tileW)
        centers.push([cx - tileW, cy - tileH])
    }

    return { tileW, tileH, centers }
  }
}

function hexCenter(
  col: number,
  row: number,
  r: number,
  direction: "horizontal" | "vertical",
  gap: number
): [number, number] {
  if (direction === "horizontal") {
    const { colStep, rowStep } = getHexSpacing(r, direction, gap)
    const x = col * colStep + colStep / 2
    const y = row * rowStep + rowStep / 2 + (col % 2 !== 0 ? rowStep / 2 : 0)
    return [x, y]
  } else {
    const { colStep, rowStep } = getHexSpacing(r, direction, gap)
    const x = col * colStep + colStep / 2 + (row % 2 !== 0 ? colStep / 2 : 0)
    const y = row * rowStep + rowStep / 2
    return [x, y]
  }
}

export function HexagonPattern({
  radius = 40,
  gap = 0,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  direction = "horizontal",
  className,
  color,
  ...props
}: HexagonPatternProps) {
  const id = useId()
  const [mounted, setMounted] = useState(false)
  const [dendrites, setDendrites] = useState<Map<string, any>>(new Map())

  useEffect(() => {
    ;(() => setMounted(true))()

    const ORANGE = "#f97316"
    const GREEN = "#22c55e"
    const { colStep, rowStep } = getHexSpacing(radius, direction, gap)

    const getNeighbors = (c: number, r: number, dir: string) => {
      if (dir === "horizontal") {
        const isOdd = Math.abs(c % 2) === 1
        return [
          [c, r - 1],
          [c, r + 1],
          [c - 1, isOdd ? r : r - 1],
          [c - 1, isOdd ? r + 1 : r],
          [c + 1, isOdd ? r : r - 1],
          [c + 1, isOdd ? r + 1 : r],
        ]
      } else {
        const isOdd = Math.abs(r % 2) === 1
        return [
          [c - 1, r],
          [c + 1, r],
          [isOdd ? c : c - 1, r - 1],
          [isOdd ? c + 1 : c, r - 1],
          [isOdd ? c : c - 1, r + 1],
          [isOdd ? c + 1 : c, r + 1],
        ]
      }
    }

    const generate = () => {
      const maxCols = Math.ceil(window.innerWidth / colStep) + 2
      const maxRows = Math.ceil(window.innerHeight / rowStep) + 2
      const minRow = Math.floor(maxRows * 0.4)

      const orangeCells = new Set<string>()
      const tips: { c: number; r: number; age: number }[] = []

      for (let c = -2; c <= maxCols + 2; c++) {
        orangeCells.add(`${c},${maxRows - 1}`)
      }

      for (
        let c = 4;
        c <= maxCols - 4;
        c += 10 + Math.floor(Math.random() * 6)
      ) {
        orangeCells.add(`${c},${maxRows - 2}`)
        tips.push({ c, r: maxRows - 2, age: 0 })
      }

      let iterations = 0
      while (tips.length > 0 && iterations < 1800) {
        iterations++
        const tipIndex = Math.floor(Math.random() * tips.length)
        const tip = tips[tipIndex]

        if (tip.r <= minRow || tip.age > 20) {
          tips.splice(tipIndex, 1)
          continue
        }

        const neighbors = getNeighbors(tip.c, tip.r, direction)
        const validMoves = neighbors.filter(
          ([nc, nr]) =>
            nr < tip.r && !orangeCells.has(`${nc},${nr}`) && nr >= minRow
        )

        if (validMoves.length === 0) {
          tips.splice(tipIndex, 1)
          continue
        }

        const nextMove =
          validMoves[Math.floor(Math.random() * validMoves.length)]
        const [nc, nr] = nextMove
        orangeCells.add(`${nc},${nr}`)

        if (Math.random() < 0.12) {
          const sideMoves = neighbors.filter(
            ([mc, mr]) => mr === tip.r && !orangeCells.has(`${mc},${mr}`)
          )
          if (sideMoves.length > 0) {
            const side = sideMoves[Math.floor(Math.random() * sideMoves.length)]
            orangeCells.add(`${side[0]},${side[1]}`)
            tips.push({ c: side[0], r: side[1], age: tip.age + 1 })
          }
        }

        tip.c = nc
        tip.r = nr
        tip.age++
      }

      const finalMap = new Map()

      for (const key of Array.from(orangeCells)) {
        const [c, r] = key.split(",").map(Number)
        finalMap.set(key, { c, r, color: ORANGE })
      }

      for (const key of Array.from(orangeCells)) {
        const [c, r] = key.split(",").map(Number)
        for (const [nc, nr] of getNeighbors(c, r, direction)) {
          const nKey = `${nc},${nr}`
          if (!orangeCells.has(nKey) && nr <= maxRows) {
            finalMap.set(nKey, { c: nc, r: nr, color: GREEN })
          }
        }
      }

      return finalMap
    }

    const runGenerationCycle = () => {
      const nextMap = generate()

      setDendrites((prev) => {
        const merged = new Map()

        for (const [k, v] of prev.entries()) {
          if (nextMap.has(k)) {
            const nextItem = nextMap.get(k)
            merged.set(k, { ...nextItem, visible: true })
          } else {
            merged.set(k, { ...v, visible: false })
          }
        }

        for (const [k, v] of nextMap.entries()) {
          if (!prev.has(k)) {
            merged.set(k, { ...v, visible: false })
          }
        }

        return merged
      })

      setTimeout(() => {
        setDendrites((prev) => {
          const updated = new Map(prev)
          for (const [k, v] of updated.entries()) {
            if (!v.visible && nextMap.has(k)) {
              updated.set(k, { ...v, visible: true })
            }
          }
          return updated
        })
      }, 60)
    }

    runGenerationCycle()

    const interval = setInterval(() => {
      runGenerationCycle()
    }, 10000)

    return () => clearInterval(interval)
  }, [radius, direction, gap])

  useEffect(() => {
    const hasInvisible = Array.from(dendrites.values()).some((v) => !v.visible)
    if (!hasInvisible) return

    const timer = setTimeout(() => {
      setDendrites((prev) => {
        const cleaned = new Map()
        for (const [k, v] of prev.entries()) {
          if (v.visible) {
            cleaned.set(k, v)
          }
        }
        return cleaned
      })
    }, 1600)

    return () => clearTimeout(timer)
  }, [dendrites])

  const { tileW, tileH, centers } = getTileGeometry(radius, direction, gap)
  const solidStroke = isSolidStrokeDasharray(strokeDasharray)
  const dashedEdges = solidStroke
    ? null
    : collectUniqueHexEdges(centers, radius, direction)

  const strokeAndFillColor = color ?? "rgba(156, 163, 175, 0.3)"

  if (!mounted) return null

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      fill={strokeAndFillColor}
      stroke={strokeAndFillColor}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={tileW}
          height={tileH}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          {solidStroke
            ? centers.map(([cx, cy]) => (
                <polygon
                  className="fill-none"
                  key={`${cx}-${cy}`}
                  points={hexPoints(cx, cy, radius, direction)}
                  strokeDasharray={strokeDasharray}
                />
              ))
            : dashedEdges?.map(([a, b]) => (
                <line
                  className="fill-none"
                  key={edgeLexKey(a, b)}
                  x1={a[0]}
                  x2={b[0]}
                  y1={a[1]}
                  y2={b[1]}
                  strokeDasharray={strokeDasharray}
                />
              ))}
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${id})`} stroke="none" />

      {dendrites.size > 0 && (
        <svg aria-hidden="true" className="overflow-visible" x={x} y={y}>
          {Array.from(dendrites.entries()).map(
            ([key, { c, r, color, visible }]) => {
              const [cx, cy] = hexCenter(c, r, radius, direction, gap)
              return (
                <polygon
                  key={key}
                  points={hexPoints(cx, cy, radius - 1, direction)}
                  strokeWidth="0"
                  style={{
                    fill: color,
                    opacity: visible ? 0.8 : 0,
                    transition:
                      "opacity 1.5s ease-in-out, fill 1.5s ease-in-out",
                  }}
                />
              )
            }
          )}
        </svg>
      )}
    </svg>
  )
}
