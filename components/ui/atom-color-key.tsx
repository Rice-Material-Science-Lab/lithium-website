export default function AtomColorKey({
  carbonSpeciesColors,
}: {
  carbonSpeciesColors?: string[]
}) {
  const carbonSwatches =
    carbonSpeciesColors && carbonSpeciesColors.length > 0
      ? carbonSpeciesColors
      : ["#DC2626"] // matches species-1 red in sim.tsx's CARBON_SPECIES_COLORS
  const carbonLabels =
    carbonSwatches.length > 1
      ? carbonSwatches.map((_, i) => `Carbon ${i + 1}`)
      : ["Carbon"]

  return (
    <div className="flex h-full shrink-0 items-stretch rounded-2xl border border-black/5 bg-white/70 p-1 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="m-2 flex h-[calc(100%-8px)] w-8 flex-col overflow-hidden rounded-xl border border-border">
        {carbonSwatches.map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
        <div className="flex-1 bg-[#16A34A] dark:bg-[#4ADE80]"></div>
        <div className="flex-1 bg-[#6B7280] dark:bg-[#52525B]"></div>
        <div className="flex-1 bg-[#F97316] dark:bg-[#FB923C]"></div>
        <div className="flex-1 bg-[#2563EB] dark:bg-[#38BDF8]"></div>
        <div className="flex-1 bg-[#E5E7EB] dark:bg-[#18181B]"></div>
      </div>
      <div className="my-2 mx-1 flex h-[calc(100%-8px)] flex-col whitespace-nowrap text-xs">
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
  )
}