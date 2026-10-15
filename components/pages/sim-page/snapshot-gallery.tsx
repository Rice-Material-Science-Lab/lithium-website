"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Check, Columns2, Download, ImageIcon, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SavePdfButton } from "@/components/ui/save-pdf-button"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

export type SnapshotParams = {
  temp: number
  dropRate: number
  bondedEnergy: number
  atomSubstrate: number
  freeAttFreq: number
  depAttFreq: number
  passAttFreq: number
  carbonEnergy: number
  carbonSites: number
}

export type SimSnapshot = {
  id: string
  name: string
  createdAt: number
  width: number
  height: number
  /** One digit per lattice cell (0–5), row by row from the substrate up. */
  cells: string
  step: number
  time: number
  params: SnapshotParams
}

const STORAGE_KEY = "lkmc-snapshots-v1"
export const MAX_SNAPSHOTS = 12

const PARAM_ROWS: { key: keyof SnapshotParams; label: string; format?: (v: number) => string }[] = [
  { key: "temp", label: "Temperature (K)" },
  { key: "dropRate", label: "Drop rate (d₀)", format: (v) => v.toLocaleString() },
  { key: "bondedEnergy", label: "Bonded energy e₀ (eV)" },
  { key: "atomSubstrate", label: "Atom-substrate e₁ (eV)" },
  { key: "freeAttFreq", label: "Free attempt freq.", format: (v) => v.toExponential(1) },
  { key: "depAttFreq", label: "Deposited attempt freq.", format: (v) => v.toExponential(1) },
  { key: "passAttFreq", label: "Passivation attempt freq.", format: (v) => v.toLocaleString() },
  { key: "carbonSites", label: "Carbon sites" },
  { key: "carbonEnergy", label: "Carbon bond energy (eV)" },
]

export function countCells(cells: string) {
  const counts = [0, 0, 0, 0, 0, 0]
  for (let i = 0; i < cells.length; i++) counts[cells.charCodeAt(i) - 48]++
  return { empty: counts[0], free: counts[1], deposited: counts[2], passivated: counts[4], carbon: counts[5] }
}

function readStored(): SimSnapshot[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Saved snapshots, kept in this browser's local storage. */
export function useSimSnapshots() {
  const [snapshots, setSnapshots] = useState<SimSnapshot[]>([])
  const [storageFull, setStorageFull] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setSnapshots(readStored()))
    return () => cancelAnimationFrame(id)
  }, [])

  const persist = useCallback((next: SimSnapshot[]) => {
    setSnapshots(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setStorageFull(false)
    } catch {
      // Quota exceeded or storage blocked: keep them for this visit only.
      setStorageFull(true)
    }
  }, [])

  const add = useCallback(
    (snap: Omit<SimSnapshot, "id" | "name" | "createdAt">) => {
      const current = snapshots
      const n = current.length ? Math.max(...current.map((s) => Number(s.name.match(/\d+$/)?.[0] ?? 0))) + 1 : 1
      const full: SimSnapshot = {
        ...snap,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: `Snapshot ${n}`,
        createdAt: Date.now(),
      }
      // Newest first; drop the oldest past the limit.
      persist([full, ...current].slice(0, MAX_SNAPSHOTS))
      return full
    },
    [persist, snapshots]
  )

  const remove = useCallback((id: string) => persist(snapshots.filter((s) => s.id !== id)), [persist, snapshots])
  const rename = useCallback(
    (id: string, name: string) => persist(snapshots.map((s) => (s.id === id ? { ...s, name: name.trim() || s.name } : s))),
    [persist, snapshots]
  )

  return { snapshots, add, remove, rename, storageFull }
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

const COLOR_VARS = [
  "--lattice-empty",
  "--lattice-free",
  "--lattice-deposited",
  "--lattice-substrate",
  "--lattice-passivated",
  "--lattice-carbon",
] as const

function readColors() {
  const cs = getComputedStyle(document.documentElement)
  return {
    cells: COLOR_VARS.map((v) => cs.getPropertyValue(v).trim() || "#888"),
    grid: cs.getPropertyValue("--lattice-grid").trim() || "transparent",
  }
}

/** Lattice colours from the theme, refreshed when light/dark mode changes. */
function useLatticeColors() {
  const [colors, setColors] = useState<ReturnType<typeof readColors> | null>(null)
  useEffect(() => {
    const update = () => setColors(readColors())
    const id = requestAnimationFrame(update)
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    return () => {
      cancelAnimationFrame(id)
      obs.disconnect()
    }
  }, [])
  return colors
}

const HEX = 10
const HEX_W = Math.sqrt(3) * HEX

/** Same geometry as hex-grid.tsx: pointy hexes, odd rows shifted half a cell, substrate at the bottom. */
function drawLattice(
  canvas: HTMLCanvasElement,
  snap: SimSnapshot,
  colors: ReturnType<typeof readColors>,
  cssWidth: number
) {
  const { width: w, height: h, cells } = snap
  const worldW = (w + 0.5) * HEX_W
  const worldH = (h - 1) * 1.5 * HEX + 2 * HEX
  const scale = cssWidth / worldW
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = Math.round(cssWidth * dpr)
  canvas.height = Math.round(worldH * scale * dpr)
  canvas.style.width = `${cssWidth}px`
  canvas.style.height = `${worldH * scale}px`

  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0)
  ctx.clearRect(0, 0, worldW, worldH)

  const hexPath = (cx: number, cy: number) => {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i - 30)
      const px = cx + HEX * Math.cos(a)
      const py = cy + HEX * Math.sin(a)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
  }

  ctx.lineWidth = 0.3
  ctx.strokeStyle = colors.grid
  for (let y = 0; y < h; y++) {
    const cy = worldH - HEX - y * 1.5 * HEX
    const shift = y % 2 ? 0.5 : 0
    // Edge filler cells so the sides look continuous, as in the live grid.
    const xs = y % 2 ? [-1] : [w]
    for (let x = 0; x < w; x++) xs.push(x)
    for (const x of xs) {
      const value = x < 0 || x >= w ? 3 : cells.charCodeAt(y * w + x) - 48
      hexPath(HEX_W * (x + shift) + HEX_W / 2, cy)
      ctx.fillStyle = colors.cells[value] ?? colors.cells[0]
      ctx.fill()
      ctx.stroke()
    }
  }
}

function LatticeCanvas({ snap, className }: { snap: SimSnapshot; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colors = useLatticeColors()

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas || !colors) return
    const render = () => drawLattice(canvas, snap, colors, wrap.clientWidth)
    render()
    const ro = new ResizeObserver(render)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [snap, colors])

  return (
    <div ref={wrapRef} className={cn("w-full", className)}>
      <canvas ref={canvasRef} className="block" role="img" aria-label={`Lattice for ${snap.name}`} />
    </div>
  )
}

function downloadPng(snap: SimSnapshot) {
  const colors = readColors()
  const canvas = document.createElement("canvas")
  drawLattice(canvas, snap, colors, 1600)
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${snap.name.replace(/[^\w-]+/g, "-")}-step${snap.step}.png`
    a.click()
    URL.revokeObjectURL(url)
  })
}

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

function SnapshotCard({
  snap,
  selected,
  onToggle,
  onRemove,
  onRename,
}: {
  snap: SimSnapshot
  selected: boolean
  onToggle: () => void
  onRemove: () => void
  onRename: (name: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(snap.name)
  const { deposited } = countCells(snap.cells)

  return (
    <li
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all",
        selected ? "border-brand ring-2 ring-brand/30" : "border-border hover:border-brand/40"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        aria-label={`${selected ? "Unselect" : "Select"} ${snap.name} for comparison`}
        className="relative block bg-muted/40 p-2"
      >
        <LatticeCanvas snap={snap} />
        <span
          className={cn(
            "absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border transition-all",
            selected
              ? "border-brand bg-brand text-brand-foreground"
              : "border-border bg-card/90 text-transparent opacity-0 group-hover:opacity-100"
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onRename(draft)
              setEditing(false)
            }}
          >
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => {
                onRename(draft)
                setEditing(false)
              }}
              maxLength={40}
              aria-label="Snapshot name"
              className="w-full rounded-md border border-brand/40 bg-background px-2 py-0.5 text-sm font-semibold outline-none"
            />
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(snap.name)
              setEditing(true)
            }}
            className="group/name flex items-center gap-1.5 text-left text-sm font-semibold text-foreground"
          >
            <span className="truncate">{snap.name}</span>
            <Pencil className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/name:opacity-60" />
          </button>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {snap.params.temp} K · d₀ {snap.params.dropRate.toLocaleString()} ·{" "}
          {deposited.toLocaleString()} deposited
        </p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="font-mono text-[11px] text-muted-foreground">
            step {snap.step.toLocaleString()}
          </span>
          <div className="flex gap-0.5">
            <button
              type="button"
              onClick={() => downloadPng(snap)}
              aria-label={`Download ${snap.name} as an image`}
              title="Download image"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Delete ${snap.name}`}
              title="Delete"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

export function SnapshotGallery({
  snapshots,
  onRemove,
  onRename,
  storageFull,
}: {
  snapshots: SimSnapshot[]
  onRemove: (id: string) => void
  onRename: (id: string, name: string) => void
  storageFull: boolean
}) {
  const [selected, setSelected] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  const live = selected.filter((id) => snapshots.some((s) => s.id === id))
  const toggle = (id: string) =>
    setSelected((cur) => {
      const valid = cur.filter((x) => snapshots.some((s) => s.id === x))
      if (valid.includes(id)) return valid.filter((x) => x !== id)
      // Keep the most recent two picks.
      return [...valid, id].slice(-2)
    })
  const pair = live.map((id) => snapshots.find((s) => s.id === id)!).filter(Boolean)

  if (snapshots.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <ImageIcon className="h-6 w-6" />
        </span>
        <p className="text-sm font-semibold text-foreground">No snapshots yet</p>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Run the simulation, then press <span className="font-semibold text-foreground">Save snapshot</span> on the
          grid. Save a few runs with different settings and compare them side by side.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 pb-3">
        <p className="text-xs text-muted-foreground">
          {snapshots.length} of {MAX_SNAPSHOTS} saved in this browser
          {storageFull && " · storage is full, so new snapshots last only for this visit"}
          {" · "}
          {live.length < 2 ? `select ${2 - live.length} to compare` : "ready to compare"}
        </p>
        <Button
          type="button"
          size="sm"
          className="gap-1.5 rounded-full"
          disabled={pair.length < 2}
          onClick={() => setCompareOpen(true)}
        >
          <Columns2 className="h-4 w-4" />
          Compare
        </Button>
      </div>
      <ul className="grid min-h-0 flex-1 auto-rows-max grid-cols-2 gap-3 overflow-y-auto pr-1 pb-4 md:grid-cols-3 xl:grid-cols-4">
        {snapshots.map((s) => (
          <SnapshotCard
            key={s.id}
            snap={s}
            selected={live.includes(s.id)}
            onToggle={() => toggle(s.id)}
            onRemove={() => onRemove(s.id)}
            onRename={(name) => onRename(s.id, name)}
          />
        ))}
      </ul>

      {pair.length === 2 && (
        <CompareDialog open={compareOpen} onOpenChange={setCompareOpen} a={pair[0]} b={pair[1]} />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Compare                                                             */
/* ------------------------------------------------------------------ */

function CompareDialog({
  open,
  onOpenChange,
  a,
  b,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  a: SimSnapshot
  b: SimSnapshot
}) {
  const ca = countCells(a.cells)
  const cb = countCells(b.cells)
  const diffRows = PARAM_ROWS.filter((r) => a.params[r.key] !== b.params[r.key])
  const sameRows = PARAM_ROWS.filter((r) => a.params[r.key] === b.params[r.key])
  const fmt = (r: (typeof PARAM_ROWS)[number], v: number) => (r.format ? r.format(v) : String(v))

  const outcome = [
    { label: "Deposited atoms", a: ca.deposited, b: cb.deposited },
    { label: "Passivated atoms", a: ca.passivated, b: cb.passivated },
    { label: "Free atoms", a: ca.free, b: cb.free },
    { label: "Steps", a: a.step, b: b.step },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <div id="snapshot-compare" className="space-y-6">
          <DialogHeader>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">Side by side</p>
            <DialogTitle className="text-2xl font-bold">
              {a.name} vs {b.name}
            </DialogTitle>
            <DialogDescription>
              {diffRows.length === 0
                ? "These runs used the same settings. Any difference comes from the randomness of the simulation."
                : `What changed: ${diffRows.map((r) => r.label.replace(/ \(.*\)$/, "").toLowerCase()).join(", ")}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            {[a, b].map((s) => (
              <figure key={s.id} className="print-avoid-break space-y-2">
                <div className="rounded-xl border border-border bg-muted/40 p-2">
                  <LatticeCanvas snap={s} />
                </div>
                <figcaption className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-foreground">{s.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {s.width}×{s.height} · step {s.step.toLocaleString()}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="print-avoid-break overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold tracking-wide">Result</th>
                  <th className="px-4 py-2 text-right font-semibold tracking-wide">{a.name}</th>
                  <th className="px-4 py-2 text-right font-semibold tracking-wide">{b.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {outcome.map((o) => (
                  <tr key={o.label}>
                    <td className="px-4 py-2 text-muted-foreground">{o.label}</td>
                    <td className="px-4 py-2 text-right font-semibold text-foreground tabular-nums">
                      {o.a.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-foreground tabular-nums">
                      {o.b.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/50 text-xs text-muted-foreground uppercase">
                  <th colSpan={3} className="px-4 py-2 text-left font-semibold tracking-wide">
                    Settings
                  </th>
                </tr>
                {[...diffRows, ...sameRows].map((r) => {
                  const differs = a.params[r.key] !== b.params[r.key]
                  return (
                    <tr key={r.key} className={cn(differs && "bg-brand/5")}>
                      <td className={cn("px-4 py-2", differs ? "font-semibold text-foreground" : "text-muted-foreground")}>
                        {r.label}
                        {differs && (
                          <span className="ml-2 rounded-full bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand uppercase">
                            changed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">{fmt(r, a.params[r.key])}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{fmt(r, b.params[r.key])}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="print-hide flex flex-wrap justify-end gap-2">
            <SavePdfButton targetId="snapshot-compare" fileName={`${a.name} vs ${b.name}`} label="Save comparison as PDF" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
