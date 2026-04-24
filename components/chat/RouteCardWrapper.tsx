import { RouteCard } from "@/components/chat/RouteCard"
import type { SeroutRoute } from "@/types/routes"

// maps tag to tone
const tagToTone = {
  "Fastest": "primary",
  "Cheapest": "secondary", 
  "Best Value": "tertiary",
  "Most Reliable": "primary"
} as const

export function RouteCardWrapper({ route, onSelect }: { 
  route: SeroutRoute
  onSelect: (route: SeroutRoute) => void 
}) {
  // convert meta.label into path steps
  // "Orca → Raydium" becomes [{icon, label}, {icon, label}]
  const path = route.meta.label.split(" → ").map((step: string) => ({
    icon: "toll",
    label: step
  }))

  return (
    <RouteCard
      title={route.tag}
      subtitle={`${route.inputToken} → ${route.outputToken}`}
      tag={route.tag as any}
      tone={tagToTone[route.tag] ?? "primary"}
      path={path}
      received={`${route.estimatedOutput} ${route.outputToken}`}
      duration={route.estimatedTime}
    />
  )
}