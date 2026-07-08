"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface CustomWasmModule {
  ccall(
    ident: string,
    returnType: string | null,
    argTypes: string[],
    args: unknown[]
  ): unknown
}

export default function SimPage() {
  // tb used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [simState, setSimState] = useState({})
  const [wasmModule, setWasmModule] = useState<CustomWasmModule | null>(null)

  useEffect(() => {
    // state setter to be set by c++ code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).onSimUpdate = (stateFromCpp: {
      totalSteps: number
      temperature: number
      pressure: number
    }) => {
      setSimState({
        totalSteps: stateFromCpp.totalSteps,
        temperature: parseFloat(stateFromCpp.temperature.toFixed(2)),
        pressure: parseFloat(stateFromCpp.pressure.toFixed(2)),
      })
    }

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
          setWasmModule(initializedModule)
        } else if (!moduleFactory) {
          console.error("The default export from lkmc-wasm.js is undefined.")
        }
      } catch (err) {
        console.error("Failed to natively import WebAssembly glue code:", err)
      }
    }

    initWasm()

    // Cleanup block
    return () => {
      active = false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onSimUpdate
    }
  }, [])

  const handleStartSim = () => {
    if (wasmModule) {
      // PARAMS FOR CALLING C++ FUNCTION: function name, return type, argument types, arguments
      wasmModule.ccall("init_simulation", null, [], [])
      wasmModule.ccall("run_steps", null, ["int"], [10000])
      console.log(
        "Ran " + wasmModule.ccall("get_step", "int", [], []) + " steps."
      )
    }
  }

  return (
    <div className="p-5">
      <h1>C++ Simulation Dashboard</h1>
      <Button onClick={handleStartSim} disabled={!wasmModule}>
        Run 10000 Steps
      </Button>

      <Card className="mt-5">
        <h3>Latest State (Updated every 1000 steps)</h3>
        <p>
          <strong>To be implemented (yes the sim is actually ran when you press the button)</strong>
        </p>
      </Card>
    </div>
  )
}
