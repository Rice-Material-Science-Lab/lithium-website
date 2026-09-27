import { Card } from "@/components/ui/card"
import { LucideIcon, Zap, Snowflake, BatteryCharging, Thermometer } from "lucide-react"
import { ActivityProps, ExoticComponent } from "react"

export function PreventionCard({
  icon: Icon,
  text1,
  text2,
}: {
  icon: LucideIcon | ExoticComponent<ActivityProps>
  text1: string
  text2: string
}) {
  return (
    <Card className="flex flex-row items-center gap-4 border border-primary/20 bg-blue-100 px-5 py-4 dark:border-cyan-900/60 dark:bg-blue-950/60">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-400/70 dark:bg-cyan-600/60">
        <Icon className="h-6 w-6 text-white"><></></Icon>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground/90">{text1}</p>
        <p className="text-sm text-muted-foreground">{text2}</p>
      </div>
    </Card>
  )
}

export const preventionTips = [
  {
    icon: Zap,
    text1: "Charge at Moderate Rates",
    text2:
      "Fast charging pushes ions in faster than they can settle evenly, encouraging dendrite growth.",
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