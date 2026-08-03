"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full border border-black/5 bg-black/4 shadow-inner data-horizontal:h-2 data-horizontal:w-full data-vertical:h-full data-vertical:w-2 dark:border-white/10 dark:bg-white/6"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute select-none bg-primary shadow-[0_0_10px_--theme(--color-primary/50%)] data-horizontal:h-full data-vertical:w-full dark:bg-cyan-500 dark:shadow-[0_0_10px_--theme(--color-cyan-500/50%)]"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block size-4 shrink-0 rounded-full border-2 border-primary bg-white shadow-md shadow-primary/30 ring-primary/20 transition-all select-none hover:scale-125 hover:ring-4 focus-visible:scale-125 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-cyan-500 dark:shadow-cyan-500/30 dark:ring-cyan-500/20"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
