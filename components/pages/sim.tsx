"use client"

import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"
import DisplayHexGrid from "@/components/ui/hex-grid"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ChevronDownIcon,
  CircleQuestionMarkIcon,
  Atom,
  HelpCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Marker, MarkerContent } from "@/components/ui/marker"
import AtomColorKey from "@/components/ui/atom-color-key"
import AtomCountsChart from "@/components/ui/atom-counts-chart"
import { Slider } from "../ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { BorderBeam } from "../ui/border-beam"
import { ButtonGroup } from "../ui/button-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

interface CustomWasmModule {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cwrap<T extends (...args: any[]) => any = (...args: unknown[]) => unknown>(
    ident: string,
    returnType: "string" | "number" | "boolean" | "array" | null,
    argTypes?: ("string" | "number" | "boolean" | "array")[],
    opts?: { async?: boolean }
  ): T

  ccall(
    ident: string,
    returnType: "string" | "number" | "boolean" | "array" | null,
    argTypes: ("string" | "number" | "boolean" | "array")[],
    args: unknown[],
    opts?: { async?: boolean }
  ): unknown

  HEAP8: Int8Array
  HEAPU8: Uint8Array
  HEAP16: Int16Array
  HEAPU16: Uint16Array
  HEAP32: Int32Array
  HEAPU32: Uint32Array
  HEAPF32: Float32Array
  HEAPF64: Float64Array

  _get_lattice(): number
  _get_width(): number
  _get_height(): number
  _get_carbon_species_grid(): number
  _malloc(size: number): number
  _free(ptr: number): void
  _run_batch(
    d0Ptr: number,
    TPtr: number,
    e0Ptr: number,
    e1Ptr: number,
    numRuns: number,
    nx: number,
    ny: number,
    stepsPerRun: number,
    baseSeed: number
  ): void
  _get_batch_json(): number
  _init_simulation(): void
  _run_steps(steps: number): void
  _get_step(): number
  _get_time(): number
  _cleanup_simulation(): void
  _force_update_frontend(): void
  _get_wall_time(): number
  _update_simulation_params(): void

  _get_stats_json(): number
  _get_stats_json_len(): number
  _set_stats_interval(interval: number): void
  _get_stats_interval(): number
  _get_terminated(): number
  _mark_carbon(x: number, y: number, species: number): void
  _unmark_carbon(x: number, y: number): void
  _finalize_carbon_placement(): void
  _pause(): void
  _play(): void
  _stop(): void
  _get_cell_coordination(x: number, y: number): number
  _get_snapshot_count(): number
  _get_snapshot_step(idx: number): number
  _get_snapshot_lattice(idx: number): number
}

function generateStartingLattice(w: number, h: number) {
  const arr = []

  for (let i = 0; i < w; i++) {
    arr.push(3)
  }

  for (let i = 0; i < (h - 1) * w; i++) {
    arr.push(0)
  }

  return arr
}

const CARBON_VALUE = 5

function applyCarbonOverlay(
  base: number[],
  w: number,
  carbonSites: Map<string, number>
) {
  const out = base.slice()
  for (const key of carbonSites.keys()) {
    const [x, y] = key.split(",").map(Number)
    const idx = y * w + x
    if (idx >= 0 && idx < out.length) {
      out[idx] = CARBON_VALUE
    }
  }
  return out
}

export default function SimPageClientView() {
  const [isLiveMode, setIsLiveMode] = useState(false)

  const [wasmModule, setWasmModule] = useState<CustomWasmModule | null>(null)

  const [gridDimensions, setGridDimensions] = useState<[number, number]>([
    60, 25,
  ])
  const [stepsRan, setStepsRan] = useState(0)
  const [runTime, setRunTime] = useState(0)
  const [width, setWidth] = useState(String(gridDimensions[0]))
  const [height, setHeight] = useState(String(gridDimensions[1]))

  const [simState, setSimState] = useState<number[]>(
    generateStartingLattice(...gridDimensions)
  )
  const [hasRunOnce, setHasRunOnce] = useState(false)
  const [simTerminated, setSimTerminated] = useState(false)
  const [drawingCarbon, setDrawingCarbon] = useState(false)
  const [carbonSites, setCarbonSites] = useState<Map<string, number>>(new Map())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [carbonUndoStack, setCarbonUndoStack] = useState<any[]>([])
  const [carbonSpecies, setCarbonSpecies] = useState(0)
  // Chosen to stay visually distinct from Deposited (orange) and
  // Passivated (green) as well as from each other: red, violet, amber,
  // cyan span separate hue families rather than clustering near orange.
  const CARBON_SPECIES_COLORS = ["#DC2626", "#7C3AED", "#CA8A04", "#0891B2"]
  const [carbonSpeciesEnergies, setCarbonSpeciesEnergies] = useState([
    -0.6, -0.4, -0.8, -0.3,
  ])
  const [selectedCell, setSelectedCell] = useState<{
    x: number
    y: number
    state: number
    coordination: number
  } | null>(null)

  const CELL_STATE_LABELS: Record<number, string> = {
    0: "Empty",
    1: "Free",
    2: "Deposited",
    3: "Substrate",
    4: "Passivated",
    5: "Carbon",
  }

  // Live preview: before the first run, reflect drawn carbon sites
  // directly on the displayed grid so users can see what they're placing.
  useEffect(() => {
    if (hasRunOnce) return

    function setDefaultSimState() {
      setSimState(
        applyCarbonOverlay(
          generateStartingLattice(...gridDimensions),
          gridDimensions[0],
          carbonSites
        )
      )
    }

    setDefaultSimState()
  }, [carbonSites, gridDimensions, hasRunOnce])

  // Keep the displayed lattice in sync with the Width/Height inputs
  // before the first run, so carbon can be drawn at the correct size
  // without needing to press Run first (drawing happens on the grid as
  // currently sized, not the size that would result from a future run).
  useEffect(() => {
    if (hasRunOnce) return
    const nx = Math.max(1, Number(width) || 0)
    const ny = Math.max(1, Number(height) || 0)
    if (nx === gridDimensions[0] && ny === gridDimensions[1]) return
    setGridDimensions([nx, ny])
  }, [width, height, hasRunOnce, gridDimensions])

  const [temp, setTemp] = useState(300)
  const [dropRate, setDropRate] = useState(1000)
  const [bondedEnergy, setBondedEnergy] = useState(-0.28)
  const [atomSubstrate, setAtomSubstrate] = useState(-0.5)
  const [freeAttFreq, setFreeAttFreq] = useState(5000000000)
  const [depAttFreq, setDepAttFreq] = useState(5000000000)
  // nu_p raised to be within reach of hop-rate order of magnitude, and
  // e_pass lowered closer to the literature-cited ~0.36 eV SEI barrier,
  // so passivation is rare-but-reachable by default instead of
  // mathematically unreachable at any slider position.
  const [passAttFreq, setPassAttFreq] = useState(1000000)
  const [ePass, setEPass] = useState(0.3)
  const [depassAttFreq, setDepassAttFreq] = useState(100000) // nu_dp
  const [eDepass, setEDepass] = useState(0.5) // e_dp -- higher than e_pass
  // by default so passivation dominates unless tuned otherwise
  const [stepsToRun, setStepsToRun] = useState("1000000")
  const [updateInterval, setUpdateInterval] = useState("10000")
  const [seed, setSeed] = useState("") // blank = random each run

  const [statsData, setStatsData] = useState<
    {
      deposited: number
      empty: number
      fill: number
      free: number
      passivated: number
      step: number
      substrate: number
      time: number
      total_rate: number
    }[]
  >([])

  const STORAGE_KEY = "lkmc-sim-params-v2"

  // Restore saved params on mount (skip grid size -- covered separately
  // by width/height inputs which already default sensibly).
  useEffect(() => {
    function restoreLocalStorageParams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)

    const clamp = (val: number, min: number, max: number) =>
      Math.min(max, Math.max(min, val))

    if (typeof saved.temp === "number")
      setTemp(clamp(saved.temp, 100, 600))
    if (typeof saved.dropRate === "number")
      setDropRate(clamp(saved.dropRate, 1, 200000))
    if (typeof saved.bondedEnergy === "number")
      setBondedEnergy(clamp(saved.bondedEnergy, -2.0, 0))
    if (typeof saved.atomSubstrate === "number")
      setAtomSubstrate(clamp(saved.atomSubstrate, -2.0, 0))
    if (typeof saved.freeAttFreq === "number")
      setFreeAttFreq(clamp(saved.freeAttFreq, 1e8, 1e10))
    if (typeof saved.depAttFreq === "number")
      setDepAttFreq(clamp(saved.depAttFreq, 1e8, 1e10))
    if (typeof saved.passAttFreq === "number")
      setPassAttFreq(clamp(saved.passAttFreq, 1e1, 1e7))
    if (Array.isArray(saved.carbonSpeciesEnergies))
      setCarbonSpeciesEnergies(
        saved.carbonSpeciesEnergies.map((e: number) => clamp(e, -2.0, 0))
      )
    if (typeof saved.depassAttFreq === "number")
      setDepassAttFreq(clamp(saved.depassAttFreq, 1e1, 1e9))
    if (typeof saved.eDepass === "number")
      setEDepass(clamp(saved.eDepass, 0, 2.0))
    if (typeof saved.ePass === "number")
      setEPass(clamp(saved.ePass, 0, 2.0))
    if (typeof saved.stepsToRun === "string")
      setStepsToRun(saved.stepsToRun)
    if (typeof saved.updateInterval === "string")
      setUpdateInterval(saved.updateInterval)
    if (typeof saved.seed === "string") setSeed(saved.seed)
  } catch (e) {
    console.error("Failed to restore saved parameters:", e)
  }
}

    restoreLocalStorageParams()
  }, [])

  // Persist params whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          temp,
          dropRate,
          bondedEnergy,
          atomSubstrate,
          freeAttFreq,
          depAttFreq,
          passAttFreq,
          carbonSpeciesEnergies,
          depassAttFreq,
          eDepass,
          ePass,
          stepsToRun,
          updateInterval,
          seed,
        })
      )
    } catch (e) {
      console.error("Failed to save parameters:", e)
    }
  }, [
    temp,
    dropRate,
    bondedEnergy,
    atomSubstrate,
    freeAttFreq,
    depAttFreq,
    passAttFreq,
    carbonSpeciesEnergies,
    depassAttFreq,
    eDepass,
    ePass,
    stepsToRun,
    updateInterval,
    seed,
  ])

  const animFrameRef = useRef<number | null>(null)
  const remainingStepsRef = useRef(0)
  const batchSizeRef = useRef(10000)
  const prevCarbonSitesRef = useRef<Map<string, number>>(new Map())
  const isPausedRef = useRef(false)
  const tickFnRef = useRef<(() => void) | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [historyMode, setHistoryMode] = useState(false)
  const [snapshotCount, setSnapshotCount] = useState(0)
  const [snapshotIndex, setSnapshotIndex] = useState(0)
  const [snapshotStep, setSnapshotStep] = useState(0)
  const latestLiveStateRef = useRef<number[]>([])
  const historyModeRef = useRef(false)

  useEffect(() => {
    historyModeRef.current = historyMode
  }, [historyMode])

  const gridContainerRef = useRef<HTMLDivElement | null>(null)
  const gridContentRef = useRef<HTMLDivElement | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getWasmBuffer(mod: any): ArrayBuffer | null {
    if (mod?.HEAP8?.buffer && mod.HEAP8.buffer.byteLength > 0) {
      return mod.HEAP8.buffer
    }
    if (mod?.wasmMemory?.buffer && mod.wasmMemory.buffer.byteLength > 0) {
      return mod.wasmMemory.buffer
    }
    if (mod?.buffer instanceof ArrayBuffer && mod.buffer.byteLength > 0) {
      return mod.buffer
    }
    if (mod?.asm?.memory?.buffer) {
      return mod.asm.memory.buffer
    }
    return null
  }

  useEffect(() => {
    let active = true

    const initWasm = async () => {
      try {
        // Cache-bust: append a timestamp so the browser can never serve a
        // stale cached copy of the WASM glue JS during development.
        const scriptUrl = `/lkmc-wasm.js?v=${Date.now()}`
        const wasmGlueCode = await import(
          /* @vite-ignore */ /* webpackIgnore: true */ scriptUrl
        )

        const moduleFactory =
          wasmGlueCode.default || wasmGlueCode.Module || wasmGlueCode

        if (typeof moduleFactory === "function" && active) {
          // Also cache-bust the .wasm binary fetch itself -- the glue JS
          // fetches this separately via its own fixed URL, so busting only
          // the .js import above does not stop the browser from serving a
          // stale cached .wasm binary.
          const wasmCacheBust = Date.now()
          const initializedModule = await moduleFactory({
            locateFile: (path: string) => {
              if (path.endsWith(".wasm")) {
                return `/${path}?v=${wasmCacheBust}`
              }
              return path
            },
          })
          if (active) {
            console.log(
              "WASM module (re)initialized at",
              new Date().toISOString()
            )
            setWasmModule(initializedModule)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(window as any).updateSimulation = (step: number) => {
              if (!active) return
              try {
                const latticePointer = initializedModule._get_lattice()
                const width = initializedModule._get_width()
                const height = initializedModule._get_height()
                const statsJsonPointer = initializedModule._get_stats_json()

                if (
                  !latticePointer ||
                  !statsJsonPointer ||
                  width === 0 ||
                  height === 0
                ) {
                  console.error(
                    "Simulation not initialized or returned null pointer."
                  )
                  return
                }

                const buffer = getWasmBuffer(initializedModule)
                if (!buffer) {
                  console.error("WebAssembly Memory buffer is not available.")
                  return
                }

                // Read the EXACT string length from WASM instead of guessing
                // a fixed window -- a fixed window can read past the end of
                // the heap and throw a RangeError, which crashes the whole
                // WASM instance since this callback runs synchronously
                // inside a C++ call stack.
                const jsonByteLength = initializedModule._get_stats_json_len()
                const safeLength = Math.max(
                  0,
                  Math.min(jsonByteLength, buffer.byteLength - statsJsonPointer)
                )

                let statsData: ReturnType<typeof JSON.parse> = []

                try {
                  const jsonStringBytes = new Uint8Array(
                    buffer,
                    statsJsonPointer,
                    safeLength
                  )
                  const decodedJsonString = new TextDecoder("utf-8").decode(
                    jsonStringBytes
                  )
                  statsData = JSON.parse(decodedJsonString)
                } catch (e) {
                  // A malformed stats frame (e.g. a transient nan/inf
                  // value during simulation jamming) is recoverable --
                  // we already fall back to the empty statsData default
                  // above, so this doesn't need to surface as a
                  // dev-overlay-triggering error, just a quiet warning.
                  console.warn(
                    "Skipped malformed stats frame from WASM memory:",
                    e
                  )
                }

                const totalElements = width * height
                const memoryView = new Int8Array(
                  buffer,
                  latticePointer,
                  totalElements
                )
                const snapshotData = Array.from(memoryView)

                setStepsRan(step)
                setRunTime(initializedModule._get_wall_time())
                latestLiveStateRef.current = snapshotData
                setSnapshotCount(initializedModule._get_snapshot_count())
                if (!historyModeRef.current) {
                  setSimState(snapshotData)
                }

                setStatsData(statsData)
                if (statsData.length > 0) {
                  const row = statsData[statsData.length - 1]
                  console.log(
                    `step=${row.step} time=${row.time} empty=${row.empty} free=${row.free} deposited=${row.deposited} passivated=${row.passivated} e_pass_used=${row.e_pass_used} nu_p_used=${row.nu_p_used}`
                  )
                }
              } catch (e) {
                console.error("updateSimulation callback failed:", e)
              }
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(window as any).onSimulationTerminated = () => {
              if (!active) return
              setSimTerminated((already) => {
                if (!already) {
                  alert(
                    "Simulation jammed: every entry column is full and no further event is possible. Adjust parameters and press Run to restart."
                  )
                }
                return true
              })
              if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current)
                animFrameRef.current = null
              }
            }
          }
        } else if (!moduleFactory) {
          console.error("The default export from lkmc-wasm.js is undefined.")
        }
      } catch (err) {
        console.error("Failed to natively import WebAssembly glue code:", err)
      }
    }

    initWasm()

    return () => {
      active = false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onSimUpdate
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).updateSimulation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onSimulationTerminated
    }
  }, [])

  const handleStartSim = (dimensions?: [number, number]) => {
    if (!wasmModule) return

    // cancel current sim
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }

    // fallback dimensions
    const [nx, ny] = dimensions ?? gridDimensions
    // Parse here (point of use) rather than on every keystroke, so the
    // input field can hold an in-progress string like "" or "01" while
    // typing without fighting the controlled-input cursor.
    const stepsToRunNum = Math.max(1, Number(stepsToRun) || 0)
    const updateIntervalNum = Math.max(1, Number(updateInterval) || 1)

    const trimmedSeed = seed.trim()
    const randomSeed =
      trimmedSeed !== "" && !Number.isNaN(Number(trimmedSeed))
        ? Math.floor(Number(trimmedSeed))
        : Math.floor(Math.random() * 1000000)

    wasmModule.ccall(
      "set_params",
      null,
      [
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
      ],
      [
        nx, // width
        ny, // height
        dropRate, // d0
        temp, // T
        bondedEnergy, // e0
        atomSubstrate, // e1
        freeAttFreq, // nu_f
        depAttFreq, // nu_d
        passAttFreq, // nu_p
        ePass, // e_pass
        depassAttFreq, // nu_dp
        eDepass, // e_dp
        randomSeed, // seed
      ]
    )

    setHasRunOnce(true)
    setSimTerminated(false)
    setIsRunning(true)
    setIsPaused(false)
    isPausedRef.current = false
    setHistoryMode(false)
    setSnapshotCount(0)
    setSnapshotIndex(0)
    setSnapshotStep(0)
    setSimState(generateStartingLattice(nx, ny))

    wasmModule._init_simulation()

    // Apply user-drawn carbon (graphite anode) sites, then rebuild the
    // rate table once for all of them together.

    carbonSpeciesEnergies.forEach((energy, sp) => {
      wasmModule.ccall(
        "set_carbon_species_energy",
        null,
        ["number", "number"],
        [sp, energy]
      )
    })

    for (const [key, species] of carbonSites) {
      const [cx, cy] = key.split(",").map(Number)
      if (cx < nx && cy < ny) {
        wasmModule._mark_carbon(cx, cy, species)
      }
    }
    wasmModule._finalize_carbon_placement()

    // Keep the stats-recording cadence (used by the chart) in sync with
    // the visual refresh cadence below, so a transient state like FREE
    // is just as likely to show up on the graph as on the lattice.
    batchSizeRef.current = updateIntervalNum
    wasmModule._set_stats_interval(batchSizeRef.current)

    remainingStepsRef.current = stepsToRunNum

    function tick() {
      if (!wasmModule || remainingStepsRef.current <= 0) return

      // Paused: freeze in place. Resume calls tickFnRef.current() to
      // restart the loop -- we don't reschedule ourselves here so the
      // loop doesn't spin uselessly every frame while paused.
      if (isPausedRef.current) return

      if (wasmModule._get_terminated()) {
        remainingStepsRef.current = 0
        setSimTerminated(true)
        setIsRunning(false)
        return
      }

      // Read live so Update Frequency changes apply mid-run.
      const batchSize = Math.max(1, batchSizeRef.current)

      if (remainingStepsRef.current >= batchSize) {
        wasmModule._run_steps(batchSize)
        remainingStepsRef.current -= batchSize
      } else {
        wasmModule._run_steps(remainingStepsRef.current)
        remainingStepsRef.current = 0 // CRITICAL: Force countdown to zero so the loop can terminate
        wasmModule._force_update_frontend()
        setIsRunning(false)
      }

      // store frame id to cancel if needed
      animFrameRef.current = requestAnimationFrame(tick)
    }

    tickFnRef.current = tick
    tick()
  }

  const handleStopSim = () => {
    if (!wasmModule) return
    if (
      stepsRan > 0 &&
      !window.confirm(
        "Stop the simulation? Progress will be discarded and you'll need to press Run to start over."
      )
    ) {
      return
    }
    wasmModule._stop()
    isPausedRef.current = false
    setIsPaused(false)
    setIsRunning(false)
    remainingStepsRef.current = 0
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    wasmModule._force_update_frontend()
  }

  const handlePauseSim = () => {
    if (!wasmModule) return
    isPausedRef.current = true
    setIsPaused(true)
    wasmModule._pause() // keeps backend playback_state_ in sync
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }

  const handleResumeSim = () => {
    if (!wasmModule) return
    isPausedRef.current = false
    setIsPaused(false)
    wasmModule._play()
    tickFnRef.current?.()
  }

  useEffect(() => {
    const handlePauseSim = () => {
      if (!wasmModule) return
      isPausedRef.current = true
      setIsPaused(true)
      wasmModule._pause() // keeps backend playback_state_ in sync
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }

    const handleResumeSim = () => {
      if (!wasmModule) return
      isPausedRef.current = false
      setIsPaused(false)
      wasmModule._play()
      tickFnRef.current?.()
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== "Space") return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return
      }
      if (!isRunning && !isPaused) return
      e.preventDefault()
      if (isPaused) {
        handleResumeSim()
      } else {
        handlePauseSim()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isRunning, isPaused, wasmModule])

  const toggleCarbonSite = (x: number, y: number) => {
    setCarbonSites((prev) => {
      setCarbonUndoStack((currentStack) => {
        const newStack = [...currentStack, new Map(prev)]

        if (newStack.length > 100) {
          newStack.shift()
        }

        return newStack
      })
      const key = `${x},${y}`
      const next = new Map(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.set(key, carbonSpecies)
      }
      return next
    })
  }

  const undoCarbonSite = () => {
    if (carbonUndoStack.length === 0) return

    const prev = carbonUndoStack[carbonUndoStack.length - 1]

    if (prev !== undefined) {
      setCarbonSites(prev)

      setCarbonUndoStack((currentStack) => currentStack.slice(0, -1))
    }
  }

  const inspectCell = (x: number, y: number) => {
    if (!wasmModule || !hasRunOnce) return
    const idx = y * gridDimensions[0] + x
    const state = simState[idx] ?? -1
    const coordination = wasmModule._get_cell_coordination(x, y)
    setSelectedCell({ x, y, state, coordination })
  }

  const loadSnapshot = (idx: number) => {
    if (!wasmModule) return
    const clampedIdx = Math.max(0, Math.min(idx, snapshotCount - 1))
    const ptr = wasmModule._get_snapshot_lattice(clampedIdx)
    if (!ptr) return

    const buffer = getWasmBuffer(wasmModule)
    if (!buffer) return

    const [nx, ny] = gridDimensions
    const view = new Int8Array(buffer, ptr, nx * ny)
    setSimState(Array.from(view))
    setSnapshotIndex(clampedIdx)
    setSnapshotStep(wasmModule._get_snapshot_step(clampedIdx))
    setHistoryMode(true)
  }

  const returnToLive = () => {
    setHistoryMode(false)
    setSimState(latestLiveStateRef.current)
  }

  const downloadCSV = (filename: string, rows: string[]) => {
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportStatsCSV = () => {
    if (statsData.length === 0) return
    const header =
      "step,time,empty,free,deposited,passivated,substrate,fill,total_rate"
    const rows = statsData.map(
      (r) =>
        `${r.step},${r.time},${r.empty},${r.free},${r.deposited},${r.passivated},${r.substrate},${r.fill},${r.total_rate}`
    )
    downloadCSV(`lkmc-stats-step${stepsRan}.csv`, [header, ...rows])
  }

  const exportLatticeCSV = () => {
    const [nx, ny] = gridDimensions
    if (simState.length === 0) return
    const rows: string[] = []
    for (let y = 0; y < ny; y++) {
      rows.push(simState.slice(y * nx, (y + 1) * nx).join(","))
    }
    downloadCSV(`lkmc-lattice-step${stepsRan}.csv`, rows)
  }

  const [batchParam, setBatchParam] = useState<"temp" | "dropRate">("temp")
  const [batchMin, setBatchMin] = useState("250")
  const [batchMax, setBatchMax] = useState("400")
  const [batchCount, setBatchCount] = useState("5")
  const [batchSteps, setBatchSteps] = useState("200000")
  const [batchResults, setBatchResults] = useState<Record<string, number>[]>([])
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 })
  const [helpOpen, setHelpOpen] = useState(false)

  const runBatch = () => {
    if (!wasmModule) return
    const count = Math.max(1, Number(batchCount) || 1)
    const min = Number(batchMin)
    const max = Number(batchMax)
    const [nx, ny] = gridDimensions
    const stepsPerRun = Math.max(1, Number(batchSteps) || 1)

    const d0Arr = new Float64Array(count)
    const TArr = new Float64Array(count)
    const e0Arr = new Float64Array(count)
    const e1Arr = new Float64Array(count)

    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : i / (count - 1)
      const value = min + t * (max - min)
      d0Arr[i] = batchParam === "dropRate" ? value : dropRate
      TArr[i] = batchParam === "temp" ? value : temp
      e0Arr[i] = bondedEnergy
      e1Arr[i] = atomSubstrate
    }

    const bytesPerArr = count * 8
    const d0Ptr = wasmModule._malloc(bytesPerArr)
    const TPtr = wasmModule._malloc(bytesPerArr)
    const e0Ptr = wasmModule._malloc(bytesPerArr)
    const e1Ptr = wasmModule._malloc(bytesPerArr)

    wasmModule.HEAPF64.set(d0Arr, d0Ptr / 8)
    wasmModule.HEAPF64.set(TArr, TPtr / 8)
    wasmModule.HEAPF64.set(e0Arr, e0Ptr / 8)
    wasmModule.HEAPF64.set(e1Arr, e1Ptr / 8)

    setBatchRunning(true)
    setBatchProgress({ done: 0, total: count })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).onBatchRunProgress = (done: number, total: number) => {
      setBatchProgress({ done, total })
    }

    // Yield one frame so the "Running..." state paints before the
    // synchronous, blocking batch loop starts.
    requestAnimationFrame(() => {
      wasmModule._run_batch(
        d0Ptr,
        TPtr,
        e0Ptr,
        e1Ptr,
        count,
        nx,
        ny,
        stepsPerRun,
        Math.floor(Math.random() * 1000000)
      )

      wasmModule._free(d0Ptr)
      wasmModule._free(TPtr)
      wasmModule._free(e0Ptr)
      wasmModule._free(e1Ptr)

      const jsonStr = wasmModule.ccall("get_batch_json", "string", [], [])
      let results: Record<string, number>[] = []
      try {
        results = JSON.parse(jsonStr as string)
      } catch (e) {
        console.error("Failed to parse batch results:", e)
      }

      setBatchResults(results)
      setBatchRunning(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onBatchRunProgress
    })
  }

  const exportBatchCSV = () => {
    if (batchResults.length === 0) return
    const header =
      "index,d0,T,e0,e1,steps_run,final_step,final_time,fill_pct,passivated,terminated,wall_time"
    const rows = batchResults.map(
      (r) =>
        `${r.index},${r.d0},${r.T},${r.e0},${r.e1},${r.steps_run},${r.final_step},${r.final_time},${r.fill_pct},${r.passivated},${r.terminated},${r.wall_time}`
    )
    downloadCSV("lkmc-batch-results.csv", [header, ...rows])
  }

  const PRESETS: Record<
    string,
    {
      temp: number
      dropRate: number
      bondedEnergy: number
      atomSubstrate: number
      freeAttFreq: number
      depAttFreq: number
      passAttFreq: number
      ePass: number
      depassAttFreq: number
      eDepass: number
    }
  > = {

    "Dense growth": {
      temp: 350,
      dropRate: 50000,
      bondedEnergy: -0.6,
      atomSubstrate: -0.8,
      freeAttFreq: 8e9,
      depAttFreq: 8e9,
      passAttFreq: 1e5,
      ePass: 0.4,
      depassAttFreq: 1e5,
      eDepass: 0.6,
    },
    "Sparse / dendritic": {
      temp: 200,
      dropRate: 500,
      bondedEnergy: -0.15,
      atomSubstrate: -0.3,
      freeAttFreq: 2e9,
      depAttFreq: 2e9,
      passAttFreq: 1e5,
      ePass: 0.3,
      depassAttFreq: 1e5,
      eDepass: 0.6,
    },
    "SEI-heavy": {
      temp: 300,
      dropRate: 2000,
      bondedEnergy: -0.28,
      atomSubstrate: -0.5,
      freeAttFreq: 5e9,
      depAttFreq: 5e9,
      passAttFreq: 5e7,
      ePass: 0.15,
      depassAttFreq: 1e6,
      eDepass: 0.4, // lower barrier than usual -- SEI actively cycles
    },
  }

  const applyPreset = (name: keyof typeof PRESETS) => {
    const p = PRESETS[name]
    setTemp(p.temp)
    setDropRate(p.dropRate)
    setBondedEnergy(p.bondedEnergy)
    setAtomSubstrate(p.atomSubstrate)
    setFreeAttFreq(p.freeAttFreq)
    setDepAttFreq(p.depAttFreq)
    setPassAttFreq(p.passAttFreq)
    setEPass(p.ePass)
    setDepassAttFreq(p.depassAttFreq)
    setEDepass(p.eDepass)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nx = Math.max(1, Number(width) || 0)
    const ny = Math.max(1, Number(height) || 0)
    const newDimensions: [number, number] = [nx, ny]
    setGridDimensions(newDimensions)

    handleStartSim(newDimensions)
  }

  useEffect(() => {
    if (!wasmModule || !isLiveMode) return

    wasmModule.ccall(
      "update_simulation_params",
      null,
      [
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
      ],
      [
        dropRate,
        temp,
        freeAttFreq,
        depAttFreq,
        passAttFreq,
        ePass,
        bondedEnergy,
        atomSubstrate,
        depassAttFreq,
        eDepass,
      ]
    )
  }, [
    isLiveMode,
    dropRate,
    temp,
    freeAttFreq,
    depAttFreq,
    passAttFreq,
    ePass,
    bondedEnergy,
    atomSubstrate,
    depassAttFreq,
    eDepass,
    wasmModule,
  ])

  // Carbon species energies: push live so mid-run tuning of anode bond
  // strength doesn't require a restart.
  useEffect(() => {
    if (!wasmModule || !isLiveMode || !hasRunOnce) return
    carbonSpeciesEnergies.forEach((energy, sp) => {
      wasmModule.ccall(
        "set_carbon_species_energy",
        null,
        ["number", "number"],
        [sp, energy]
      )
    })
  }, [isLiveMode, hasRunOnce, carbonSpeciesEnergies, wasmModule])

  // Update Frequency: live-adjust the stats/visual batch cadence.
  useEffect(() => {
    if (!wasmModule || !isLiveMode) return
    const updateIntervalNum = Math.max(1, Number(updateInterval) || 1)
    batchSizeRef.current = updateIntervalNum
    wasmModule._set_stats_interval(updateIntervalNum)
  }, [isLiveMode, updateInterval, wasmModule])

  // Steps: live-adjust how many more steps the current run will execute,
  // treating a live edit as "steps remaining from now" rather than
  // "total steps for this run" (the latter has no meaning mid-run).
  useEffect(() => {
    if (!wasmModule || !isLiveMode || !hasRunOnce) return
    const stepsToRunNum = Math.max(1, Number(stepsToRun) || 0)
    remainingStepsRef.current = stepsToRunNum
  }, [isLiveMode, stepsToRun, hasRunOnce, wasmModule])

  // Carbon sites: push added/removed sites to the running sim and rebuild
  // rates once, instead of requiring a full restart to see new anode sites.
  useEffect(() => {
    if (!wasmModule || !isLiveMode || !hasRunOnce) {
      prevCarbonSitesRef.current = carbonSites
      return
    }

    const prev = prevCarbonSitesRef.current
    let changed = false

    for (const [key, species] of carbonSites) {
      if (!prev.has(key)) {
        const [cx, cy] = key.split(",").map(Number)
        wasmModule._mark_carbon(cx, cy, species)
        changed = true
      }
    }

    for (const key of prev.keys()) {
      if (!carbonSites.has(key)) {
        const [cx, cy] = key.split(",").map(Number)
        wasmModule._unmark_carbon(cx, cy)
        changed = true
      }
    }

    if (changed) {
      wasmModule._finalize_carbon_placement()
    }

    prevCarbonSitesRef.current = carbonSites
  }, [carbonSites, isLiveMode, hasRunOnce, wasmModule])

  return (
    <>
      <div className="relative flex h-full w-full flex-col overflow-hidden">
        <div className="relative z-10 flex h-full w-full flex-col overflow-hidden p-5">
          <div className="flex shrink-0 items-center gap-3 px-4 pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary dark:bg-cyan-500">
              <Atom className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary dark:text-cyan-500">
                LKMC Electrodeposition Simulator
              </h1>
              <h2 className="text-xs text-muted-foreground">
                Lattice Kinetic Monte Carlo &middot; 2D Electrodeposition
              </h2>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-full"
              onClick={() => setHelpOpen(true)}
            >
              <HelpCircle size={15} />
              How to use
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 gap-4 p-4">
            <form
              onSubmit={handleSubmit}
              className="flex h-full w-[30%] shrink-0 flex-col justify-between gap-6"
            >
              <Card className="flex h-full flex-col justify-start rounded-2xl border border-border backdrop-blur-xl">
                <CardHeader className="pl-2">
                  <h3 className="flex items-center gap-2 text-xl font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Parameters
                  </h3>
                </CardHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-2 py-4">
                  <Alert className="flex shrink-0 items-center justify-between overflow-hidden rounded-xl border-border p-3!">
                    <div className="space-y-1">
                      <AlertTitle className="leading-none">
                        <Label
                          htmlFor="live-mode"
                          className="cursor-pointer text-sm font-medium"
                        >
                          Live Mode
                        </Label>
                      </AlertTitle>
                      <AlertDescription>
                        <p className="text-xs text-muted-foreground">
                          Update WASM parameters in real time
                        </p>
                      </AlertDescription>
                    </div>
                    <AlertAction className="mt-0 shrink-0">
                      <Switch
                        id="live-mode"
                        checked={isLiveMode}
                        onCheckedChange={setIsLiveMode}
                      />
                    </AlertAction>
                    <BorderBeam
                      size={100}
                      colorFrom={
                        isLiveMode ? "var(--color-primary)" : "transparent"
                      }
                      colorTo={
                        isLiveMode ? "var(--color-primary)" : "transparent"
                      }
                      borderWidth={2}
                    />
                    <BorderBeam
                      size={100}
                      colorFrom={
                        isLiveMode ? "var(--color-primary)" : "transparent"
                      }
                      colorTo={
                        isLiveMode ? "var(--color-primary)" : "transparent"
                      }
                      borderWidth={2}
                      delay={3}
                    />
                  </Alert>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(PRESETS).map((name) => (
                      <Button
                        key={name}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() =>
                          applyPreset(name as keyof typeof PRESETS)
                        }
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="width-input"
                      className="flex items-center text-sm font-medium"
                    >
                      Width
                      <Tooltip>
                        <TooltipTrigger className="ml-2" type="button">
                          <CircleQuestionMarkIcon
                            size={17}
                          ></CircleQuestionMarkIcon>
                        </TooltipTrigger>
                        <TooltipContent>
                          The width of the simulation lattice
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="width-input"
                      type="number"
                      min={1}
                      className="rounded-xl"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                    />
                    <Label
                      htmlFor="height-input"
                      className="flex items-center text-sm font-medium"
                    >
                      Height
                      <Tooltip>
                        <TooltipTrigger className="ml-2" type="button">
                          <CircleQuestionMarkIcon
                            size={17}
                          ></CircleQuestionMarkIcon>
                        </TooltipTrigger>
                        <TooltipContent>
                          The height of the simulation lattice
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="height-input"
                      type="number"
                      min={1}
                      className="rounded-xl"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />

                    <Separator className="my-4 bg-linear-to-r from-transparent via-primary/50 to-transparent dark:via-primary/50" />

                    <Alert className="flex shrink-0 items-center justify-between overflow-hidden rounded-xl border-border p-3!">
                      <div className="space-y-1">
                        <AlertTitle className="leading-none">
                          <Label
                            htmlFor="draw-carbon"
                            className="cursor-pointer text-sm font-medium"
                          >
                            Draw Carbon (Anode)
                          </Label>
                        </AlertTitle>
                        <AlertDescription>
                          <p className="text-xs text-muted-foreground">
                            Click grid cells to place graphite anode sites
                          </p>
                        </AlertDescription>
                      </div>
                      <AlertAction className="mt-0 shrink-0">
                        <Switch
                          id="draw-carbon"
                          checked={drawingCarbon}
                          onCheckedChange={setDrawingCarbon}
                        />
                      </AlertAction>
                    </Alert>
                    {drawingCarbon && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">
                          Anode species (drawing as)
                        </Label>
                        <div className="flex gap-2">
                          {carbonSpeciesEnergies.map((_, sp) => (
                            <button
                              key={sp}
                              type="button"
                              onClick={() => setCarbonSpecies(sp)}
                              className={
                                "h-7 w-7 rounded-full border-2 transition-all " +
                                (carbonSpecies === sp
                                  ? "scale-110 border-primary"
                                  : "border-transparent opacity-70 hover:opacity-100")
                              }
                              style={{
                                backgroundColor: CARBON_SPECIES_COLORS[sp],
                              }}
                              title={`Species ${sp + 1}`}
                            />
                          ))}
                        </div>
                        {carbonSpeciesEnergies.map((energy, sp) => (
                          <div key={sp} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">
                                Species {sp + 1} bond energy (eV)
                              </span>
                              <span className="font-mono text-xs text-muted-foreground">
                                {energy}
                              </span>
                            </div>
                            <Slider
                              min={-2.0}
                              max={0}
                              step={0.01}
                              value={[energy]}
                              onValueChange={(val: number[]) =>
                                setCarbonSpeciesEnergies((prev) => {
                                  const next = prev.slice()
                                  next[sp] = val[0]
                                  return next
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {carbonSites.size > 0 && (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 rounded-full"
                          onClick={() => {
                            carbonUndoStack.push(new Map(carbonSites))
                            setCarbonSites(new Map())
                          }}
                        >
                          Clear Carbon ({carbonSites.size})
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full"
                          onClick={undoCarbonSite}
                          disabled={carbonUndoStack.length === 0}
                        >
                          Undo
                        </Button>
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="flex flex-col gap-4">
                      {/* temp */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="temp-input"
                            className="flex items-center text-sm font-medium"
                          >
                            <span>Temperature (K)</span>
                            <Tooltip>
                              <TooltipTrigger className="ml-2" type="button">
                                <CircleQuestionMarkIcon size={17} />
                              </TooltipTrigger>
                              <TooltipContent>
                                The temperature being simulated
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <span className="font-mono text-sm text-muted-foreground">
                            {temp} K
                          </span>
                        </div>
                        <Slider
                          id="temp-input"
                          min={100}
                          max={600}
                          step={1}
                          value={[temp]}
                          onValueChange={(val: number[]) => setTemp(val[0])}
                        />
                      </div>

                      {/* drop rate */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="drop-rate-input"
                            className="flex items-center text-sm font-medium"
                          >
                            <span>
                              Drop Rate (d<sub>0</sub>)
                            </span>
                            <Tooltip>
                              <TooltipTrigger className="ml-2" type="button">
                                <CircleQuestionMarkIcon size={17} />
                              </TooltipTrigger>
                              <TooltipContent>
                                The rate at which atoms spawn
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <span className="font-mono text-sm text-muted-foreground">
                            {dropRate}
                          </span>
                        </div>
                        <Slider
                          id="drop-rate-input"
                          min={1}
                          max={200000}
                          step={100}
                          value={[dropRate]}
                          onValueChange={(val: number[]) => setDropRate(val[0])}
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* play options */}

                    <Label
                      htmlFor="steps-to-run-input"
                      className="flex items-center text-sm font-medium"
                    >
                      Steps
                      <Tooltip>
                        <TooltipTrigger className="ml-2" type="button">
                          <CircleQuestionMarkIcon
                            size={17}
                          ></CircleQuestionMarkIcon>
                        </TooltipTrigger>
                        <TooltipContent>
                          The amount of steps that will be run upon starting the
                          simulation
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="steps-to-run-input"
                      type="number"
                      min={1}
                      className="rounded-xl"
                      value={stepsToRun}
                      onChange={(e) => setStepsToRun(e.target.value)}
                    />

                    <Label
                      htmlFor="update-interval-input"
                      className="mt-2 flex items-center text-sm font-medium"
                    >
                      Update Frequency (steps)
                      <Tooltip>
                        <TooltipTrigger className="ml-2" type="button">
                          <CircleQuestionMarkIcon
                            size={17}
                          ></CircleQuestionMarkIcon>
                        </TooltipTrigger>
                        <TooltipContent>
                          How many simulated steps run between each visual and
                          chart update. Lower values show short-lived states
                          like free atoms more often, at the cost of
                          performance.
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="update-interval-input"
                      type="number"
                      min={1}
                      className="rounded-xl"
                      value={updateInterval}
                      onChange={(e) => setUpdateInterval(e.target.value)}
                    />

                    <Label
                      htmlFor="seed-input"
                      className="mt-2 flex items-center text-sm font-medium"
                    >
                      Seed (optional)
                      <Tooltip>
                        <TooltipTrigger className="ml-2" type="button">
                          <CircleQuestionMarkIcon
                            size={17}
                          ></CircleQuestionMarkIcon>
                        </TooltipTrigger>
                        <TooltipContent>
                          Fix the RNG seed to reproduce an identical run. Leave
                          blank for a new random seed each time.
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="seed-input"
                      type="number"
                      placeholder="random"
                      className="rounded-xl"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                    />

                    {/* advanced options */}

                    <Collapsible className="w-full rounded-md">
                      <CollapsibleTrigger className="w-full">
                        <Marker variant="separator" className="my-2 w-full">
                          <MarkerContent className="flex items-center gap-2">
                            Advanced <ChevronDownIcon />
                          </MarkerContent>
                        </Marker>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-col gap-4">
                          {/* bonded energy */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="bonded-energy-input"
                                className="flex items-center text-sm font-medium"
                              >
                                <span>
                                  Bonded Energy e<sub>0</sub> (eV)
                                </span>
                                <Tooltip>
                                  <TooltipTrigger
                                    className="ml-2"
                                    type="button"
                                  >
                                    <CircleQuestionMarkIcon size={17} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    The energy stored in bonds between atoms;
                                    Farther negative values make bonds
                                    atoms&apos; bonds stronger
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <span className="font-mono text-sm text-muted-foreground">
                                {bondedEnergy}
                              </span>
                            </div>
                            <Slider
                              id="bonded-energy-input"
                              min={-2.0}
                              max={0}
                              step={0.01}
                              value={[bondedEnergy]}
                              onValueChange={(val: number[]) =>
                                setBondedEnergy(val[0])
                              }
                            />
                          </div>

                          {/* atom-substrate energy */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="atom-substrate-input"
                                className="flex items-center text-sm font-medium"
                              >
                                <span>
                                  Atom-substrate e<sub>1</sub> (eV)
                                </span>
                                <Tooltip>
                                  <TooltipTrigger
                                    className="ml-2"
                                    type="button"
                                  >
                                    <CircleQuestionMarkIcon size={17} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    The energy stored in bonds between atoms and
                                    the substrate; Being more negative than the
                                    bonded energy promotes vertical growth
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <span className="font-mono text-sm text-muted-foreground">
                                {atomSubstrate}
                              </span>
                            </div>
                            <Slider
                              id="atom-substrate-input"
                              min={-2.0}
                              max={0}
                              step={0.01}
                              value={[atomSubstrate]}
                              onValueChange={(val: number[]) =>
                                setAtomSubstrate(val[0])
                              }
                            />
                          </div>

                          {/* free att freq */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="free-att-freq-input"
                                className="flex items-center text-sm font-medium"
                              >
                                <span>Free Attempt Freq. (v_f)</span>
                                <Tooltip>
                                  <TooltipTrigger
                                    className="ml-2"
                                    type="button"
                                  >
                                    <CircleQuestionMarkIcon size={17} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Vibrational frequency of isolated surface
                                    atoms that may attempt displacement
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <span className="font-mono text-sm text-muted-foreground">
                                {freeAttFreq.toExponential(1)}
                              </span>
                            </div>
                            <Slider
                              id="free-att-freq-input"
                              min={1e8}
                              max={1e10}
                              step={1e8}
                              value={[freeAttFreq]}
                              onValueChange={(val: number[]) =>
                                setFreeAttFreq(val[0])
                              }
                            />
                          </div>

                          {/* dep att freq */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="dep-att-freq-input"
                                className="flex items-center text-sm font-medium"
                              >
                                <span>Dep. Attempt Freq. (v_d)</span>
                                <Tooltip>
                                  <TooltipTrigger
                                    className="ml-2"
                                    type="button"
                                  >
                                    <CircleQuestionMarkIcon size={17} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Vibrational frequency of bonded surface
                                    atoms that may attempt displacement
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <span className="font-mono text-sm text-muted-foreground">
                                {depAttFreq.toExponential(1)}
                              </span>
                            </div>
                            <Slider
                              id="dep-att-freq-input"
                              min={1e8}
                              max={1e10}
                              step={1e8}
                              value={[depAttFreq]}
                              onValueChange={(val: number[]) =>
                                setDepAttFreq(val[0])
                              }
                            />
                          </div>

                          {/* pass att freq */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="pass-att-freq-input"
                                className="flex items-center text-sm font-medium"
                              >
                                <span>Passivation Attempt Freq. (v_p)</span>
                                <Tooltip>
                                  <TooltipTrigger
                                    className="ml-2"
                                    type="button"
                                  >
                                    <CircleQuestionMarkIcon size={17} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Vibrational frequency of isolated surface
                                    atoms that are beneath the SEI layer
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <span className="font-mono text-sm text-muted-foreground">
                                {passAttFreq.toLocaleString()}
                              </span>
                            </div>
                            <Slider
                              id="pass-att-freq-input"
                              min={1e1}
                              max={1e7}
                              step={1e3}
                              value={[passAttFreq]}
                              onValueChange={(val: number[]) =>
                                setPassAttFreq(val[0])
                              }
                            />
                          </div>

                          {/* passivation energy barrier */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="e-pass-input"
                                className="flex items-center text-sm font-medium"
                              >
                                <span>
                                  Passivation Energy Barrier (E_pass)
                                </span>
                                <Tooltip>
                                  <TooltipTrigger
                                    className="ml-2"
                                    type="button"
                                  >
                                    <CircleQuestionMarkIcon size={17} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Activation energy penalizing lithium ion
                                    trying to pass through SEI
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <span className="font-mono text-sm text-muted-foreground">
                                {ePass}
                              </span>
                            </div>
                            <Slider
                              id="e-pass-input"
                              min={0}
                              max={2.0}
                              step={0.01}
                              value={[ePass]}
                              onValueChange={(val: number[]) =>
                                setEPass(val[0])
                              }
                            />
                          </div>

                          {/* de-passivation attempt freq */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="depass-att-freq-input"
                                className="flex items-center text-sm font-medium"
                              >
                                <span>De-passivation Attempt Freq. (v_dp)</span>
                                <Tooltip>
                                  <TooltipTrigger
                                    className="ml-2"
                                    type="button"
                                  >
                                    <CircleQuestionMarkIcon size={17} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Vibrational frequency governing SEI
                                    breakdown, reverting a passivated atom back
                                    to deposited
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <span className="font-mono text-sm text-muted-foreground">
                                {depassAttFreq.toExponential(1)}
                              </span>
                            </div>
                            <Slider
                              id="depass-att-freq-input"
                              min={1e1}
                              max={1e9}
                              step={1e5}
                              value={[depassAttFreq]}
                              onValueChange={(val: number[]) =>
                                setDepassAttFreq(val[0])
                              }
                            />
                          </div>

                          {/* de-passivation energy barrier */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="e-depass-input"
                                className="flex items-center text-sm font-medium"
                              >
                                <span>
                                  De-passivation Energy Barrier (E_dp)
                                </span>
                                <Tooltip>
                                  <TooltipTrigger
                                    className="ml-2"
                                    type="button"
                                  >
                                    <CircleQuestionMarkIcon size={17} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Activation energy penalizing SEI breakdown;
                                    higher values make de-passivation rarer
                                    relative to passivation
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <span className="font-mono text-sm text-muted-foreground">
                                {eDepass}
                              </span>
                            </div>
                            <Slider
                              id="e-depass-input"
                              min={0}
                              max={2.0}
                              step={0.01}
                              value={[eDepass]}
                              onValueChange={(val: number[]) =>
                                setEDepass(val[0])
                              }
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
                <CardFooter className="mt-auto! flex gap-2 p-0">
                  <ButtonGroup className="w-full" aria-label="Button group">
                    <Button
                      type="submit"
                      variant="default"
                      className="dark:hover:bg-primary-400 w-1/2 flex-1 rounded-xl hover:bg-primary/90"
                      disabled={!wasmModule}
                    >
                      {wasmModule
                        ? "Run " +
                          (Number(stepsToRun) || 0).toLocaleString() +
                          " steps"
                        : "Loading WASM..."}
                    </Button>
                    {isPaused ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-1/4"
                        onClick={handleResumeSim}
                        disabled={!wasmModule}
                      >
                        Resume
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePauseSim}
                        disabled={!wasmModule || !isRunning}
                      >
                        Pause
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleStopSim}
                      disabled={!wasmModule || (!isRunning && !isPaused)}
                    >
                      Stop
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            </form>
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <Card className="flex min-h-0 flex-1 flex-col items-center justify-between gap-0 rounded-2xl border p-4 backdrop-blur-xl">
                <div className="flex w-full grow flex-row justify-between gap-2 min-h-0">
                  <div className="flex grow flex-col">
                    {simTerminated && (
                      <Alert variant="destructive" className="mb-2 w-full">
                        <AlertTitle>Simulation jammed</AlertTitle>
                        <AlertDescription>
                          Every entry column is full and no further event is
                          possible. Adjust parameters and press Run to restart.
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex h-full w-full flex-1 gap-4">
                      <div className="flex h-full flex-1 grow flex-col items-center">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 rounded-full border border-black/5 px-3 py-1 dark:border-white/10">
                            <span
                              className={
                                "h-2 w-2 rounded-full " +
                                (simTerminated
                                  ? "bg-destructive"
                                  : isPaused
                                    ? "bg-yellow-500"
                                    : isRunning
                                      ? "animate-pulse bg-green-500"
                                      : "bg-muted-foreground")
                              }
                            />
                            <span className="text-xs font-medium text-muted-foreground">
                              {simTerminated
                                ? "Jammed"
                                : isPaused
                                  ? "Paused"
                                  : isRunning
                                    ? "Running"
                                    : "Stopped"}
                            </span>
                          </div>
                          <h3 className="text-center text-sm font-medium text-muted-foreground">
                            After {stepsRan.toLocaleString()} steps and{" "}
                            {runTime.toFixed(2)} seconds
                          </h3>
                        </div>

                        <div
                          ref={gridContainerRef}
                          className="relative flex w-full flex-1 grow items-center justify-center overflow-hidden"
                          style={{
                            touchAction: "manipulation",
                            WebkitUserSelect: "none",
                            userSelect: "none",
                            // Chrome/Firefox try to start a native HTML5
                            // drag gesture on mousedown over SVG content,
                            // which swallows the click before it reaches
                            // the hexagon's onClick. Safari doesn't do
                            // this, so this is a no-op there.
                            WebkitUserDrag: "none",
                          } as React.CSSProperties}
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                          onPointerDown={(e) => e.preventDefault()}
                        >
                          <div
                            ref={gridContentRef}
                            className="h-full w-full grow"
                          >
                            <DisplayHexGrid
                              width={gridDimensions[0]}
                              height={gridDimensions[1]}
                              data={simState}
                              carbonSpeciesMap={carbonSites}
                              carbonSpeciesColors={CARBON_SPECIES_COLORS}
                              onCellClick={
                                historyMode
                                  ? undefined
                                  : drawingCarbon
                                    ? (x: number, y: number) =>
                                        toggleCarbonSite(x, y)
                                    : (x: number, y: number) =>
                                        inspectCell(x, y)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedCell && (
                      <div className="mt-2 w-full rounded-xl border border-primary/20 bg-primary/5 p-2 text-xs text-muted-foreground">
                        Cell ({selectedCell.x}, {selectedCell.y}):{" "}
                        {CELL_STATE_LABELS[selectedCell.state] ?? "Unknown"}
                        {selectedCell.coordination >= 0 &&
                          ` · coordination ${selectedCell.coordination}`}
                      </div>
                    )}
                  </div>
                  <AtomColorKey carbonSpeciesColors={CARBON_SPECIES_COLORS} />
                </div>
                <div
                  className={
                    "mt-2 flex h-8 w-full shrink-0 items-center gap-2 " +
                    (snapshotCount > 1 ? "visible" : "invisible")
                  }
                >
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, snapshotCount - 1)}
                    value={
                      historyMode
                        ? snapshotIndex
                        : Math.max(0, snapshotCount - 1)
                    }
                    onChange={(e) => loadSnapshot(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs whitespace-nowrap text-muted-foreground">
                    {historyMode
                      ? `step ${snapshotStep.toLocaleString()}`
                      : "live"}
                  </span>
                  {historyMode && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full text-primary"
                      onClick={returnToLive}
                    >
                      Back to Live
                    </Button>
                  )}
                </div>
              </Card>
              <Card className="flex h-1/2 min-h-0 flex-1 flex-col rounded-2xl p-4 backdrop-blur-xl">
                <Tabs defaultValue="atom-counts" className="h-full w-full">
                  <TabsList>
                    <TabsTrigger value="atom-counts">Atom Counts</TabsTrigger>
                    <TabsTrigger value="batch-run">Batch Run</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="atom-counts"
                    className="flex h-full flex-col"
                  >
                    <div className="min-h-0 flex-1">
                      <AtomCountsChart data={statsData} />
                    </div>

                    <div className="mt-4 flex shrink-0 gap-2 pb-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={exportStatsCSV}
                        disabled={statsData.length === 0}
                      >
                        Export Stats CSV
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={exportLatticeCSV}
                        disabled={simState.length === 0}
                      >
                        Export Lattice CSV
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="batch-run">
                    <div className="mb-4 flex shrink-0 items-center justify-between">
                      <h3 className="text-lg font-semibold">Batch Run</h3>
                    </div>
                    <div className="flex flex-wrap items-end gap-2">
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Sweep parameter</Label>
                        <Select
                          value={batchParam}
                          onValueChange={(value) =>
                            setBatchParam(value as "temp" | "dropRate")
                          }
                        >
                          <SelectTrigger className="rounded-xl px-2 py-1 text-sm">
                            <SelectValue placeholder="Theme" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="temp">Temperature</SelectItem>
                            <SelectItem value="dropRate">Drop Rate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Min</Label>
                        <Input
                          className="w-24 rounded-xl"
                          type="number"
                          value={batchMin}
                          onChange={(e) => setBatchMin(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Max</Label>
                        <Input
                          className="w-24 rounded-xl"
                          type="number"
                          value={batchMax}
                          onChange={(e) => setBatchMax(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Runs</Label>
                        <Input
                          className="w-20 rounded-xl"
                          type="number"
                          min={1}
                          value={batchCount}
                          onChange={(e) => setBatchCount(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Steps / run</Label>
                        <Input
                          className="w-28 rounded-xl"
                          type="number"
                          min={1}
                          value={batchSteps}
                          onChange={(e) => setBatchSteps(e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        className="rounded-xl"
                        onClick={runBatch}
                        disabled={!wasmModule || batchRunning}
                      >
                        {batchRunning
                          ? `Running ${batchProgress.done}/${batchProgress.total}...`
                          : "Run Batch"}
                      </Button>
                      {batchResults.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full"
                          onClick={exportBatchCSV}
                        >
                          Export CSV
                        </Button>
                      )}
                    </div>
                    {batchResults.length > 0 && (
                      <div className="mt-2 max-h-40 shrink-0 overflow-auto rounded-xl border border-border">
                        <table className="w-full text-xs">
                          <thead className="sticky top-0 bg-primary/30">
                            <tr>
                              <th className="p-1 text-left">#</th>
                              <th className="p-1 text-left">T</th>
                              <th className="p-1 text-left">d0</th>
                              <th className="p-1 text-left">Fill %</th>
                              <th className="p-1 text-left">Passivated</th>
                              <th className="p-1 text-left">Jammed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {batchResults.map((r) => (
                              <tr
                                key={r.index}
                                className="border-t border-border hover:bg-primary/5 dark:border-border dark:hover:bg-primary/5"
                              >
                                <td className="p-1">{r.index}</td>
                                <td className="p-1">{r.T}</td>
                                <td className="p-1">{r.d0}</td>
                                <td className="p-1">
                                  {r.fill_pct?.toFixed(1)}
                                </td>
                                <td className="p-1">{r.passivated}</td>
                                <td className="p-1">
                                  {r.terminated ? "yes" : "no"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle
                size={18}
                className="text-primary dark:text-cyan-500"
              />
              How the simulator works
            </DialogTitle>
            <DialogDescription>
              A quick reference for the lattice, parameters, and controls.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 text-sm">
            <section>
              <h4 className="mb-2 font-semibold">Overview</h4>
              <p className="text-muted-foreground">
                This simulates lithium electrodeposition on a 2D hexagonal
                lattice using Kinetic Monte Carlo (KMC): atoms drop onto the
                lattice, hop between sites, bond to neighbors, and can be
                passivated by a growing SEI (solid-electrolyte interphase)
                layer. Every parameter below feeds into the rate equations that
                decide which event happens next and how quickly.
              </p>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Lattice cell states</h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#E5E7EB] dark:bg-[#18181B]" />
                  <span>
                    <span className="font-medium">Empty</span> &mdash;
                    unoccupied site.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#2563EB] dark:bg-[#38BDF8]" />
                  <span>
                    <span className="font-medium">Free</span> &mdash; mobile
                    atom, not yet bonded to a neighbor.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#F97316] dark:bg-[#FB923C]" />
                  <span>
                    <span className="font-medium">Deposited</span> &mdash;
                    bonded to at least one neighbor.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#6B7280] dark:bg-[#52525B]" />
                  <span>
                    <span className="font-medium">Substrate</span> &mdash; the
                    fixed bottom row atoms grow from.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#16A34A] dark:bg-[#4ADE80]" />
                  <span>
                    <span className="font-medium">Passivated</span> &mdash; a
                    deposited atom coated by SEI; can revert via de-passivation.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#DC2626] dark:bg-[#F87171]" />
                  <span>
                    <span className="font-medium">Carbon</span> &mdash; a
                    user-drawn graphite anode site.
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Core parameters</h4>
              <ul className="flex flex-col gap-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">
                    Width / Height
                  </span>{" "}
                  &mdash; lattice dimensions in cells.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Temperature (K)
                  </span>{" "}
                  &mdash; sets the Boltzmann factor in every rate; higher T
                  makes energy differences matter less.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Drop Rate (d&#8320;)
                  </span>{" "}
                  &mdash; how often new atoms spawn at the top row.
                </li>
                <li>
                  <span className="font-medium text-foreground">Steps</span>{" "}
                  &mdash; total KMC steps to run when you press Run.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Update Frequency
                  </span>{" "}
                  &mdash; how many steps run between each visual/chart refresh;
                  lower values show short-lived states (like Free) more often,
                  at a performance cost.
                </li>
                <li>
                  <span className="font-medium text-foreground">Seed</span>{" "}
                  &mdash; fixes the RNG for a reproducible run; leave blank for
                  a random seed each time.
                </li>
              </ul>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Advanced parameters</h4>
              <ul className="flex flex-col gap-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">
                    Bonded Energy e&#8320;
                  </span>{" "}
                  &mdash; atom-atom bond strength; more negative = stronger
                  bonds = slower diffusion.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Atom-substrate e&#8321;
                  </span>{" "}
                  &mdash; bond strength to the substrate; more negative than
                  e&#8320; promotes vertical growth.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Free / Dep. Attempt Freq. (v_f, v_d)
                  </span>{" "}
                  &mdash; how often free vs. bonded atoms attempt to hop.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Passivation Attempt Freq. / Barrier (v_p, E_pass)
                  </span>{" "}
                  &mdash; governs how readily exposed deposited atoms get coated
                  by SEI; E_pass Boltzmann-suppresses v_p the same way E_dp
                  suppresses v_dp for de-passivation.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    De-passivation Attempt Freq. / Barrier (v_dp, E_dp)
                  </span>{" "}
                  &mdash; governs SEI breakdown, reverting Passivated back to
                  Deposited. Keeping E_dp higher than E_pass keeps passivation
                  dominant by default.
                </li>
              </ul>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">
                Drawing carbon (graphite anode)
              </h4>
              <p className="text-muted-foreground">
                Toggle{" "}
                <span className="font-medium text-foreground">Draw Carbon</span>
                , pick a species swatch, then click lattice cells to mark them
                as anode sites before pressing Run. Each species has its own
                independently tunable bond energy slider. Use{" "}
                <span className="font-medium text-foreground">Undo</span> or{" "}
                <span className="font-medium text-foreground">
                  Clear Carbon
                </span>{" "}
                to fix mistakes.
              </p>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Live Mode</h4>
              <p className="text-muted-foreground">
                When enabled, changing any slider (including carbon energies,
                Steps, and Update Frequency) applies instantly to a running
                simulation instead of requiring a restart. Carbon sites you add
                or remove while Live Mode is on are also pushed to the running
                sim immediately.
              </p>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Presets</h4>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  Dense growth
                </span>
                ,{" "}
                <span className="font-medium text-foreground">
                  Sparse / dendritic
                </span>
                , and{" "}
                <span className="font-medium text-foreground">SEI-heavy</span>{" "}
                are ready-made parameter sets that produce visually distinct
                growth regimes &mdash; a fast way to explore the model without
                hand-tuning every slider.
              </p>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Batch Run</h4>
              <p className="text-muted-foreground">
                Sweeps Temperature or Drop Rate across a Min&ndash;Max range
                over several independent runs (each with its own random seed),
                holding everything else fixed. Useful for seeing how fill % or
                passivation trends with one parameter. Results are exportable as
                CSV, and the panel can be collapsed with the &times; button when
                you don&apos;t need it.
              </p>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Grid controls</h4>
              <ul className="flex flex-col gap-2 text-muted-foreground">
                <li>Click-drag the lattice to pan; to adjust scale.</li>
                <li>
                  Click any cell (outside of Draw Carbon mode) to inspect its
                  state and coordination number.
                </li>
                <li>
                  The slider beneath the grid scrubs through saved lattice
                  snapshots &mdash; use &ldquo;Back to Live&rdquo; to return to
                  the current step.
                </li>
                <li>
                  Press{" "}
                  <kbd className="rounded border border-border bg-black/5 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
                    Space
                  </kbd>{" "}
                  to pause/resume a running simulation.
                </li>
              </ul>
            </section>

            <section>
              <h4 className="mb-2 font-semibold">Exporting data</h4>
              <p className="text-muted-foreground">
                Use{" "}
                <span className="font-medium text-foreground">
                  Export Stats CSV
                </span>{" "}
                for the step-by-step counts chart, and{" "}
                <span className="font-medium text-foreground">
                  Export Lattice CSV
                </span>{" "}
                for a snapshot of the current grid state as a grid of cell
                codes.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
