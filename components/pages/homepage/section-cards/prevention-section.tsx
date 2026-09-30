import { PreventionCard, preventionTips } from "./prevention-card"
import ChargeRiskChecker from "./charge-risk-checker"
import { Panel } from "../layout-primitives"

export default function PreventionSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {preventionTips.map((tip) => (
          <PreventionCard
            key={tip.text1}
            {...tip}
            className={tip.tip ? "md:col-span-3" : undefined}
          />
        ))}
      </div>
      <Panel>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground">
            Try it: how risky is this charge?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick the conditions and see how they stack up.
          </p>
        </div>
        <ChargeRiskChecker />
      </Panel>
    </div>
  )
}