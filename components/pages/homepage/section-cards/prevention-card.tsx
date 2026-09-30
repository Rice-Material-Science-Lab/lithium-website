import {
  LucideIcon,
  Zap,
  Snowflake,
  BatteryCharging,
  Thermometer,
  Smartphone,
} from "lucide-react"
import { FeatureCard } from "../layout-primitives"

export function PreventionCard({
  icon,
  text1,
  text2,
  tip,
  href,
  linkLabel,
  className,
}: {
  icon: LucideIcon
  text1: string
  text2: string
  tip?: string
  href?: string
  linkLabel?: string
  className?: string
}) {
  return (
    <FeatureCard
      icon={icon}
      title={text1}
      href={href}
      linkLabel={linkLabel}
      className={className}
    >
      <p>{text2}</p>
      {tip && (
        <p className="mt-3 flex items-start gap-2 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-foreground/80 dark:border-cyan-500/20 dark:bg-cyan-500/5">
          <Smartphone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary dark:text-cyan-400" />
          <span>{tip}</span>
        </p>
      )}
    </FeatureCard>
  )
}

export const preventionTips: {
  icon: LucideIcon
  text1: string
  text2: string
  tip?: string
}[] = [
  {
    icon: Zap,
    text1: "Charge at Moderate Rates",
    text2:
      "Fast charging pushes ions in faster than they can settle evenly, encouraging dendrite growth.",
    tip: "Try it on your phone: turn on Optimized Battery Charging (iPhone) or Adaptive Charging / Battery Protection (Android) in your battery settings. Your phone learns your routine and eases off the last stretch of charging instead of rushing to 100%.",
  },
  {
    icon: Snowflake,
    text1: "Avoid Charging in the Cold",
    text2:
      "Charging below freezing slows ion diffusion, making uneven, dendrite-prone plating more likely.",
  },
  {
    icon: BatteryCharging,
    text1: "Don't Overcharge",
    text2:
      "Sitting at 100% for long periods stresses the electrode and encourages filament growth.",
  },
  {
    icon: Thermometer,
    text1: "Keep Temperatures Moderate",
    text2:
      "Excess heat during charging accelerates degradation and uneven lithium deposition.",
  },
]