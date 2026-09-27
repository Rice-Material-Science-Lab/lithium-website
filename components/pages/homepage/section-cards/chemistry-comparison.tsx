import { Card } from "@/components/ui/card"

const chemistryRows = [
  {
    label: "Typical energy density",
    nmc: "~200–270 Wh/kg",
    lfp: "~150–160 Wh/kg",
    solidState: "300+ Wh/kg (projected)",
  },
  {
    label: "Dendrite susceptibility",
    nmc: "Higher",
    lfp: "Lower",
    solidState: "Lower at the electrode, but can form along grain boundaries",
  },
  {
    label: "Thermal stability",
    nmc: "Moderate",
    lfp: "High",
    solidState: "High (no flammable liquid electrolyte)",
  },
  {
    label: "Typical cycle life",
    nmc: "~1,000–2,000 cycles",
    lfp: "~3,000–6,000 cycles",
    solidState: "Still being characterized",
  },
  {
    label: "Commercial maturity",
    nmc: "Mature, widespread",
    lfp: "Mature, widespread",
    solidState: "Early-stage / pilot production",
  },
]

export default function ChemistryComparison() {
  return (
    <Card className="space-y-4 rounded-2xl p-8 shadow-sm max-w-8/10">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Chemistry
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          Not all lithium batteries carry the same risk
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Chemistry changes how easily dendrites form and how a cell behaves if
          one gets through anyway.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-140 border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold text-foreground/70">
                &nbsp;
              </th>
              <th className="py-2 pr-4 font-semibold text-foreground">NMC</th>
              <th className="py-2 pr-4 font-semibold text-foreground">LFP</th>
              <th className="py-2 pr-4 font-semibold text-foreground">
                Solid-State
              </th>
            </tr>
          </thead>
          <tbody>
            {chemistryRows.map((row) => (
              <tr key={row.label} className="border-b border-border/60">
                <td className="py-3 pr-4 font-medium text-muted-foreground">
                  {row.label}
                </td>
                <td className="py-3 pr-4 text-foreground/90">{row.nmc}</td>
                <td className="py-3 pr-4 text-foreground/90">{row.lfp}</td>
                <td className="py-3 pr-4 text-foreground/90">
                  {row.solidState}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}