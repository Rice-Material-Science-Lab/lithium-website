import { Card } from "@/components/ui/card"
import { PreventionCard, preventionTips } from "../prevention-card"

export default function PreventionSection() {
  return (
    <Card className="max-w-8/10 space-y-4 rounded-2xl p-8 shadow-sm">
      <div>
        <p className="mb-1 text-xs font-bold tracking-widest text-primary uppercase dark:text-cyan-500">
          Prevention
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          Dendrite Prevention Tips
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          A few habits keep lithium plating slow, even, and manageable.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {preventionTips.map((tip) => (
          <PreventionCard key={tip.text1} {...tip} />
        ))}
      </div>
    </Card>
  )
}
