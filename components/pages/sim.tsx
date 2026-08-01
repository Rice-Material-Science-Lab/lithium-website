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
import { ChevronDownIcon, CircleQuestionMarkIcon } from "lucide-react"
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
  _mark_carbon(x: number, y: number): void
  _finalize_carbon_placement(): void
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
  carbonSites: Set<string>
) {
  const out = base.slice()
  for (const key of carbonSites) {
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
  const [carbonSites, setCarbonSites] = useState<Set<string>>(new Set())

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
  const [carbonBondEnergy, setCarbonBondEnergy] = useState(-0.6)
  const [stepsToRun, setStepsToRun] = useState(1000000)
  const [updateInterval, setUpdateInterval] = useState(10000)

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

  const animFrameRef = useRef<number | null>(null)

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
                  console.error(
                    "Failed to read/parse stats JSON from WASM memory:",
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
                setSimState(snapshotData)

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
              setSimTerminated(true)
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

    const randomSeed = Math.floor(Math.random() * 1000000)

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
      ],
      [
        nx, // width
        ny, // height
        dropRate, // d0
        temp, // T
        bondedEnergy, // e0
        atomSubstrate, // e1
        carbonBondEnergy, // e_c
        freeAttFreq, // nu_f
        depAttFreq, // nu_d
        passAttFreq, // nu_p
        ePass, // e_pass
        randomSeed, // seed
      ]
    )

    setHasRunOnce(true)
    setSimTerminated(false)
    setSimState(generateStartingLattice(nx, ny))

    wasmModule._init_simulation()

    // Apply user-drawn carbon (graphite anode) sites, then rebuild the
    // rate table once for all of them together.


    for (const key of carbonSites) {
      const [cx, cy] = key.split(",").map(Number)
      if (cx < nx && cy < ny) {
        wasmModule._mark_carbon(cx, cy)
      }
    }
    wasmModule._finalize_carbon_placement()


    // Keep the stats-recording cadence (used by the chart) in sync with
    // the visual refresh cadence below, so a transient state like FREE
    // is just as likely to show up on the graph as on the lattice.
    const batchSize = updateIntervalNum
    wasmModule._set_stats_interval(batchSize)
    console.log(
      "Requested stats interval:",
      batchSize,
      "-- WASM confirms:",
      wasmModule._get_stats_interval()
    )

    let remaining = stepsToRunNum

    function tick() {
      if (!wasmModule || remaining <= 0) return

      if (wasmModule._get_terminated()) {
        setSimTerminated(true)
        return
      }

      if (remaining >= batchSize) {
        wasmModule._run_steps(batchSize)
        remaining -= batchSize
      } else {
        wasmModule._run_steps(remaining)
        remaining = 0 // CRITICAL: Force countdown to zero so the loop can terminate
        wasmModule._force_update_frontend()
      }

      // store frame id to cancel if needed
      animFrameRef.current = requestAnimationFrame(tick)
    }

    tick()
  }

  const toggleCarbonSite = (x: number, y: number) => {
    setCarbonSites((prev) => {
      const key = `${x},${y}`
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const handleSubmit = (e: React.SubmitEvent) => {
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
      ["number", "number", "number", "number", "number", "number", "number", "number", "number"],
      [dropRate, temp, freeAttFreq, depAttFreq, passAttFreq, ePass, carbonBondEnergy, bondedEnergy, atomSubstrate]
    )
  }, [
    isLiveMode,
    dropRate,
    temp,
    freeAttFreq,
    depAttFreq,
    passAttFreq,
    ePass,
    carbonBondEnergy,
    bondedEnergy,
    atomSubstrate,
    wasmModule,
  ])

  return (
    <>
      <div className="relative flex h-full w-full flex-col overflow-hidden p-5">
        <div className="flex shrink-0 items-center gap-4 px-4">
          <h1 className="text-2xl font-bold text-primary dark:text-cyan-500">
            LKMC Electrodeposition Simulator
          </h1>
          <h2>Lattice Kinetic Monte Carlo - 2d Electrodeposition</h2>
        </div>
        <div className="flex min-h-0 flex-1 gap-4 p-4">
          <form
            onSubmit={handleSubmit}
            className="flex h-full w-[30%] shrink-0 flex-col justify-between gap-6"
          >
            <Card className="flex h-full flex-col justify-start p-4">
              <CardHeader className="pl-2">
                <h3 className="text-2xl font-bold">Parameters</h3>
              </CardHeader>

              <div className="flex flex-col gap-4 overflow-y-auto px-2 py-4">
                <Alert className="flex shrink-0 items-center justify-between overflow-hidden p-3!">
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
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="width-input"
                    className="flex items-center text-sm font-medium"
                  >
                    Width
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
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
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                  <Label
                    htmlFor="height-input"
                    className="flex items-center text-sm font-medium"
                  >
                    Height
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
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
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />

                  <Separator className="my-4" />

                  <Alert className="flex shrink-0 items-center justify-between overflow-hidden p-3!">
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
                  {carbonSites.size > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setCarbonSites(new Set())}
                    >
                      Clear Carbon ({carbonSites.size})
                    </Button>
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
                        onValueChange={(val) => setTemp(val[0])}
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
                        onValueChange={(val) => setDropRate(val[0])}
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
                      <TooltipTrigger className="ml-2">
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
                    value={stepsToRun}
                    onChange={(e) => setStepsToRun(+e.target.value)}
                  />

                  <Label
                    htmlFor="update-interval-input"
                    className="mt-2 flex items-center text-sm font-medium"
                  >
                    Update Frequency (steps)
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
                        <CircleQuestionMarkIcon
                          size={17}
                        ></CircleQuestionMarkIcon>
                      </TooltipTrigger>
                      <TooltipContent>
                        How many simulated steps run between each visual and
                        chart update. Lower values show short-lived states like
                        free atoms more often, at the cost of performance.
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="update-interval-input"
                    type="number"
                    min={1}
                    value={updateInterval}
                    onChange={(e) => setUpdateInterval(+e.target.value)}
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
                                <TooltipTrigger className="ml-2" type="button">
                                  <CircleQuestionMarkIcon size={17} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  The energy stored in bonds between atoms;
                                  Farther negative values make bonds atoms&apos;
                                  bonds stronger
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
                            onValueChange={(val) => setBondedEnergy(val[0])}
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
                                <TooltipTrigger className="ml-2" type="button">
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
                            onValueChange={(val) => setAtomSubstrate(val[0])}
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
                                <TooltipTrigger className="ml-2" type="button">
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
                            onValueChange={(val) => setFreeAttFreq(val[0])}
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
                                <TooltipTrigger className="ml-2" type="button">
                                  <CircleQuestionMarkIcon size={17} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Vibrational frequency of bonded surface atoms
                                  that may attempt displacement
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
                            onValueChange={(val) => setDepAttFreq(val[0])}
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
                                <TooltipTrigger className="ml-2" type="button">
                                  <CircleQuestionMarkIcon size={17} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Vibrational frequency of isolated surface
                                  atoms that are beneath the SEI layer
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <span className="font-mono text-sm text-muted-foreground">
                              {passAttFreq.toExponential(1)}
                            </span>
                          </div>
                          <Slider
                            id="pass-att-freq-input"
                            min={1e1}
                            max={1e9}
                            step={1e5}
                            value={[passAttFreq]}
                            onValueChange={(val) => setPassAttFreq(val[0])}
                          />
                        </div>

                        {/* pass energy barrier */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="e-pass-input"
                              className="flex items-center text-sm font-medium"
                            >
                              <span>Passivation Energy Barrier (E_pass)</span>
                              <Tooltip>
                                <TooltipTrigger className="ml-2" type="button">
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
                            onValueChange={(val) => setEPass(val[0])}
                          />
                        </div>

                        {/* carbon bond energy */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="carbon-bond-energy-input"
                              className="flex items-center text-sm font-medium"
                            >
                              <span>
                                Carbon Bond Energy e<sub>c</sub> (eV)
                              </span>
                              <Tooltip>
                                <TooltipTrigger className="ml-2" type="button">
                                  <CircleQuestionMarkIcon size={17} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  The Li-C bond energy at graphite anode sites;
                                  more negative values make lithium bind more
                                  strongly to drawn carbon
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <span className="font-mono text-sm text-muted-foreground">
                              {carbonBondEnergy}
                            </span>
                          </div>
                          <Slider
                            id="carbon-bond-energy-input"
                            min={-2.0}
                            max={0}
                            step={0.01}
                            value={[carbonBondEnergy]}
                            onValueChange={(val) => setCarbonBondEnergy(val[0])}
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
              <CardFooter className="mt-auto! p-0">
                <Button type="submit" className="w-full" disabled={!wasmModule}>
                  {wasmModule
                    ? "Run " +
                      (Number(stepsToRun) || 0).toLocaleString() +
                      " steps"
                    : "Loading WASM..."}
                </Button>
              </CardFooter>
            </Card>
          </form>
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <Card className="flex min-h-0 flex-1 flex-col items-center justify-center gap-0 p-4">
              {simTerminated && (
                <Alert variant="destructive" className="mb-2 w-full">
                  <AlertTitle>Simulation jammed</AlertTitle>
                  <AlertDescription>
                    Every entry column is full and no further event is
                    possible. Adjust parameters and press Run to restart.
                  </AlertDescription>
                </Alert>
              )}
              <h3 className="text-center text-sm font-medium text-muted-foreground">
                After {stepsRan.toLocaleString()} steps and {runTime.toFixed(2)}{" "}
                seconds
              </h3>
              <div className="flex min-h-0 w-full flex-1 justify-center gap-4">
                <DisplayHexGrid
                  width={gridDimensions[0]}
                  height={gridDimensions[1]}
                  data={simState}
                  onCellClick={
                    drawingCarbon
                      ? (x: number, y: number) => toggleCarbonSite(x, y)
                      : undefined
                  }
                />
                <AtomColorKey />
              </div>
            </Card>
            <Card className="flex min-h-0 flex-1 flex-col p-4">
              <AtomCountsChart data={statsData} />
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
