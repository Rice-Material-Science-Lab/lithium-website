"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import DisplayHexGrid from "@/components/ui/hex-grid"

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

  _get_lattice_data(): number
  _get_width(): number
  _get_height(): number

  _init_simulation(): void
  _run_steps(steps: number): void
  _get_step(): number
  _get_time(): number
  _cleanup_simulation(): void
}

function generateStartingLattice(w: number, h: number) {
  const arr = []

  for (let i = 0; i < w * 2; i++) {
    arr.push(3)
  }

  for (let i = 0; i < (h - 2) * w; i++) {
    arr.push(0)
  }

  return arr
}

export default function SimPage() {
  const [simState, setSimState] = useState<number[]>(
    generateStartingLattice(40, 25)
  )
  const [wasmModule, setWasmModule] = useState<CustomWasmModule | null>(null)
  const [stepsRan, setStepsRan] = useState(0)
  const [runTime, setRunTime] = useState(0)

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
        const scriptUrl = "/lkmc-wasm.js"
        const wasmGlueCode = await import(
          /* @vite-ignore */ /* webpackIgnore: true */ scriptUrl
        )

        const moduleFactory = wasmGlueCode.default

        if (typeof moduleFactory === "function" && active) {
          const initializedModule = await moduleFactory()
          if (active) {
            setWasmModule(initializedModule)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(window as any).updateSimulation = (step: number) => {
              if (!active) return

              const pointer = initializedModule._get_lattice_data()
              const width = initializedModule._get_width()
              const height = initializedModule._get_height()

              if (!pointer || width === 0 || height === 0) {
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

              const totalElements = width * height

              const memoryView = new Int8Array(buffer, pointer, totalElements)

              const snapshotData = Array.from(memoryView)

              setStepsRan(step)
              setRunTime(initializedModule._get_time())
              setSimState(snapshotData)
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
    }
  }, [])

  const handleStartSim = () => {
    if (wasmModule) {
      const randomSeed = Math.floor(Math.random() * 1000000)

      console.log(randomSeed)

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
        ],
        [
          80, // Nx
          25, // Ny
          1.0e3, // d0
          300.0, // T
          -0.2, // e0
          -0.5, // e1
          5.0e9, // nu_f
          1.0e9, // nu_d
          randomSeed, // seed (randomized)
        ]
      )

      wasmModule._init_simulation()

      let remaining = 1000000

      function tick() {
        if (!wasmModule || remaining <= 0) return

        wasmModule._run_steps(1000)
        remaining -= 1000

        requestAnimationFrame(tick)
      }

      tick()
    }
  }

  useEffect(() => {
    console.log(runTime)
  }, [runTime])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-5">
      <div className="flex shrink-0 items-center gap-4 px-4">
        <h1 className="text-2xl text-primary dark:text-cyan-500">
          LKMC Electrodeposition Simulator
        </h1>
        <h2>Lattice Kinetic Monte Carlo - 2d Electrodeposition</h2>
      </div>
      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <Card className="flex w-[20%] shrink-0 flex-col items-center justify-around p-4">
          <h3 className="text-4xl">PARAMS</h3>
          <Button
            className="w-full"
            onClick={handleStartSim}
            disabled={!wasmModule}
          >
            {wasmModule ? "Run 1,000,000 Steps" : "Loading Wasm..."}
          </Button>
        </Card>
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <Card className="flex min-h-0 flex-1 flex-col items-center justify-center p-4">
            <p className="text-md shrink-0">
              After {stepsRan} steps and {runTime.toFixed(2)}ms
            </p>
            <div className="min-h-0 w-full flex-1">
              <DisplayHexGrid width={40} height={25} data={simState} />
            </div>
          </Card>
          <Card className="flex min-h-0 flex-1 shrink-0 items-center justify-center">
            <h3 className="text-6xl">ATOM COUNTS</h3>
          </Card>
        </div>
      </div>
    </div>
  )
}
