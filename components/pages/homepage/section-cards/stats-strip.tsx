import { Card } from "@/components/ui/card"

const stats = [
  { value: "$5B+", label: "Cost of the Samsung Note7 recall" },
  { value: "$2B+", label: "Cost of the Chevy Bolt EV recall" },
  { value: "20+", label: "Deaths from NYC e-bike battery fires in 2023" },
  { value: "6+ hrs", label: "Burn time of the Victorian Big Battery fire" },
]

export default function StatsStrip() {
  return (
    <Card className="max-w-8/10 rounded-2xl p-8 shadow-sm">
      <div className="mb-6">
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          By the numbers
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          The stakes, in scale
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="space-y-1">
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}