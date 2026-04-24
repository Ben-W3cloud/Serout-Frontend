// FILE LOCATION: app/api/simulate/route.ts
//
// PURPOSE: Takes a selected route and returns final simulation numbers
// before the user confirms. This is the "preview" step.
//
// Called after: user clicks "Select Route" on a RouteCard
// Returns: final output amount, fees, estimated time

import { NextRequest, NextResponse } from "next/server"
import { getJupiterQuote } from "@/lib/jupiter"
import { TOKEN_DECIMALS } from "@/constants/token"

export async function POST(req: NextRequest) {
  const body = await req.json()

  // The frontend sends the full selected route object
  const { route } = body

  // Guard — if no route was sent, return an error
  if (!route) {
    return NextResponse.json(
      { success: false, error: "No route provided" },
      { status: 400 }
    )
  }

  try {
    // SWAP ROUTE — re-fetch a fresh Jupiter quote for accuracy
    // We re-fetch because the original quote may be stale (prices change fast)
    if (route.transferType === "swap") {

      // Get a fresh quote using the same parameters as the original route
      // We use the slippage from the original jupiterQuote stored on the route
      const freshQuote = await getJupiterQuote(
        route.inputToken,
        route.outputToken,
        route.inputAmount,
        route.jupiterQuote.slippageBps // preserve original slippage choice
      )

      // Convert the raw output amount back to human-readable number
      const outputAmount =
        Number(freshQuote.outAmount) /
        Math.pow(10, TOKEN_DECIMALS[route.outputToken])

      // Calculate the fee amount from feeBps (basis points)
      // feeBps of 2 means 0.02% fee
      // formula: (outputAmount * feeBps) / 10000
      const feeAmount = (outputAmount * freshQuote.feeBps) / 10000

      return NextResponse.json({
        success: true,
        simulation: {
          // What the user will actually receive
          outputAmount,

          // Fee charged by the DEX
          feeAmount,

          // Time estimate from original route
          estimatedTime: route.estimatedTime,

          // Price impact — how much this swap moves the market
          // Negative means favorable for the user
          priceImpact: freshQuote.priceImpactPct,

          // The path the swap will take e.g. "Orca → Raydium"
          routePath: freshQuote.routePlan
            .map((r: any) => r.swapInfo?.label)
            .filter(Boolean)
            .join(" → "),

          // Store the fresh quote — needed later for /api/execute
          jupiterQuote: freshQuote,

          // Pass through original route data for display
          inputAmount: route.inputAmount,
          inputToken: route.inputToken,
          outputToken: route.outputToken,
        },
      })
    }

    // DIRECT ROUTE — no API call needed, just calculate from route data
    if (route.transferType === "direct") {
      return NextResponse.json({
        success: true,
        simulation: {
          // For direct transfers, output = input minus network fee
          outputAmount: route.estimatedOutput,
          feeAmount: route.estimatedFee,
          estimatedTime: route.estimatedTime,
          priceImpact: "0", // no price impact on direct transfers
          routePath: route.meta.label,
          inputAmount: route.inputAmount,
          inputToken: route.inputToken,
          outputToken: route.outputToken,
        },
      })
    }

    // BANK ROUTE — mock simulation, same as direct but output is in NGN
    if (route.transferType === "bank") {
      return NextResponse.json({
        success: true,
        simulation: {
          outputAmount: route.estimatedOutput,  // already in NGN from generateBankRoutes
          feeAmount: route.estimatedFee,
          estimatedTime: route.estimatedTime,
          priceImpact: "0",
          routePath: route.meta.label,          // e.g. "Flutterwave → GTBank (••••6789)"
          inputAmount: route.inputAmount,
          inputToken: route.inputToken,
          outputToken: "NGN",
        },
      })
    }

    // If transferType doesn't match any known type
    return NextResponse.json(
      { success: false, error: "Unknown transfer type" },
      { status: 400 }
    )

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}