import { cn } from "@/lib/utils"

export default function AtomColorKey({
  isFullscreen,
  carbonSpeciesColors,
}: {
  carbonSpeciesColors?: string[]
  isFullscreen: boolean
}) {
  const carbonSwatches =
    carbonSpeciesColors && carbonSpeciesColors.length > 0
      ? carbonSpeciesColors
      : ["var(--lattice-carbon)"] // matches species-1 red in sim.tsx's CARBON_SPECIES_COLORS
  const carbonLabels =
    carbonSwatches.length > 1
      ? carbonSwatches.map((_, i) => `Carbon ${i + 1}`)
      : ["Carbon"]

  return (
    <>
      <div className="hidden h-full items-center sm:flex">
        <div
          className={cn(
            "flex h-full shrink-0 items-stretch rounded-2xl border border-border bg-card/70 p-1 backdrop-blur-xl",
            isFullscreen && "max-h-1/2"
          )}
        >
          <div className="m-2 flex h-[calc(100%-8px)] w-8 flex-col overflow-hidden rounded-xl border border-border">
            {carbonSwatches.map((color, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: color }}
              />
            ))}
            <div className="flex-1 bg-lattice-passivated"></div>
            <div className="flex-1 bg-lattice-substrate"></div>
            <div className="flex-1 bg-lattice-deposited"></div>
            <div className="flex-1 bg-lattice-free"></div>
            <div className="flex-1 bg-lattice-empty"></div>
          </div>
          <div className="mx-1 my-2 flex h-[calc(100%-8px)] flex-col text-xs whitespace-nowrap">
            {carbonLabels.map((label) => (
              <div key={label} className="flex flex-1 items-center">
                {label}
              </div>
            ))}
            <div className="flex flex-1 items-center">Passivated</div>
            <div className="flex flex-1 items-center">Substrate</div>
            <div className="flex flex-1 items-center">Deposited</div>
            <div className="flex flex-1 items-center">Free</div>
            <div className="flex flex-1 items-center">Empty</div>
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-3 gap-x-3 gap-y-1.5 rounded-2xl border border-border bg-card/70 px-3 py-2.5 backdrop-blur-xl sm:hidden">
        {[
          ...carbonSwatches.map((color, i) => ({
            color,
            label: carbonLabels[i],
          })),
          { color: "var(--lattice-passivated)", label: "Passivated" },
          { color: "var(--lattice-substrate)", label: "Substrate" },
          { color: "var(--lattice-deposited)", label: "Deposited" },
          { color: "var(--lattice-free)", label: "Free" },
          { color: "var(--lattice-empty)", label: "Empty" },
        ].map(({ color, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-xs whitespace-nowrap"
          >
            <span
              aria-hidden
              className="h-3 w-3 shrink-0 rounded-[4px] border border-border"
              style={{ backgroundColor: color }}
            />
            {label}
          </span>
        ))}
      </div>
    </>
  )
}
