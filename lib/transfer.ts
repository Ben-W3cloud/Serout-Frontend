import { SeroutRoute } from "@/types/routes";

export function generateDirectRoutes(
  token: string,
  amount: number,
  fromAddress: string,
  toAddress: string
): SeroutRoute[] {

  const fastRoute : SeroutRoute = {
      id: `fast-${Date.now()}`,              // unique id for this route
      tag: "Fastest",
      transferType: "direct",
      inputAmount:amount,
      inputToken: token,
      outputToken: token,
      estimatedOutput: (amount - 0.00001),
      estimatedFee: 0.00001,
      estimatedTime: "~20s",
      jupiterQuote: undefined,
      meta: {
       label: `Direct Transfer from ${fromAddress} to ${toAddress}`,
       reliable: false
      }
    }

    // for cheapRoute, tag = "Cheapest"
    const cheapRoute : SeroutRoute = {
     id: `cheap-${Date.now()}`,              // unique id for this route
      tag: "Cheapest",
      transferType: "direct",
      inputAmount:amount,
      inputToken:token,
      outputToken:token,
      estimatedOutput: (amount - 0.000001),
      estimatedFee: 0.000001,
      estimatedTime: "~30s",
      jupiterQuote:undefined,
      meta: {
       label: `Direct Transfer from ${fromAddress} to ${toAddress}`,
       reliable: true
      }
    }

    // for bestRoute, tag = "Best Value"
    const bestRoute : SeroutRoute = {
     id: `best-${Date.now()}`,              // unique id for this route
      tag: "Best Value",
      transferType: "direct",
      inputAmount:amount,
      inputToken:token,
      outputToken:token,
      estimatedOutput: (amount - 0.000005),
      estimatedFee: 0.000005,
      estimatedTime: "~25s",
      jupiterQuote:undefined,
      meta: {
       label: `Direct Transfer from ${fromAddress} to ${toAddress}`,
       reliable: true
      }
    }

    const routes : SeroutRoute[] = [fastRoute,cheapRoute, bestRoute]
    return routes
}