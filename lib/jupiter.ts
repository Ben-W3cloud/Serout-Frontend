// imports needed
import { toSmallestUnit, SOLANA_TOKEN_MINTS, TOKEN_DECIMALS } from "@/constants/token"
import { SeroutRoute } from "@/types/routes";

export async function getJupiterQuote(
  inputToken: string,
  outputToken: string,
  amount: number, slippageBps: number = 50
) {
  // 1. convert amount to smallest unit using your helper
  const newAmount = toSmallestUnit(amount, inputToken); 

  // 2. get the mint addresses from your constants
   const inputMint = SOLANA_TOKEN_MINTS[inputToken]
   const outputMint = SOLANA_TOKEN_MINTS[outputToken]

  // 3. build the Jupiter quote URL
   const JUP_QUOTE_API = "https://api.jup.ag/swap/v2/order";

   const url = `${JUP_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${newAmount}&slippageBps=${slippageBps}`;

  // 4. fetch it

   const quote = await fetch(url, {
    headers: {
        'Authorization': `Bearer ${process.env.JUPITER_API_KEY}`
        }
    })

   if (!quote.ok) {
      throw new Error(`Jupiter quote failed: ${quote.status}`)
    }
   const response = await quote.json()

  // 5. return the json response
  return response
}

export async function generateSwapRoutes(
  inputToken: string,
  outputToken: string,
  amount: number
): Promise< SeroutRoute[]> {

  // call getJupiterQuote 3 times with different slippageBps
  // hint: you'll need to update getJupiterQuote to accept slippage as a parameter

  const [fastQuote, cheapQuote, bestQuote] = await Promise.all([
    getJupiterQuote(inputToken, outputToken, amount, 100),
    getJupiterQuote(inputToken, outputToken, amount, 10),
    getJupiterQuote(inputToken, outputToken, amount, 50),
  ])

//   now build a SeroutRoute object for each quote
//   for fastQuote, tag = "Fastest"

  const fastRoute : SeroutRoute = {
     id: `fast-${Date.now()}`,              // unique id for this route
      tag: "Fastest",
      transferType: "swap",
      inputAmount:amount,
      inputToken,
      outputToken,
      estimatedOutput: Number(fastQuote.outAmount) / Math.pow(10, TOKEN_DECIMALS[outputToken]),
      estimatedFee:  (Number(fastQuote.outAmount) * fastQuote.feeBps) / 10000,
      estimatedTime: "~15s",
      jupiterQuote: fastQuote,
      meta: {
       label: fastQuote.routePlan.map((r: any) => r.swapInfo.label).join(" → "),
       reliable: false
      }
    }

    // for cheapRoute, tag = "Cheapest"
    const cheapRoute : SeroutRoute = {
     id: `cheap-${Date.now()}`,              // unique id for this route
      tag: "Cheapest",
      transferType: "swap",
      inputAmount:amount,
      inputToken,
      outputToken,
      estimatedOutput: Number(cheapQuote.outAmount) / Math.pow(10, TOKEN_DECIMALS[outputToken]),
      estimatedFee: (Number(cheapQuote.outAmount) * cheapQuote.feeBps) / 10000,
      estimatedTime: "~40s",
      jupiterQuote: cheapQuote,
      meta: {
       label: cheapQuote.routePlan.map((r: any) => r.swapInfo.label).join(" → "),
       reliable: true
      }
    }

    // for bestRoute, tag = "Best Value"
    const bestRoute : SeroutRoute = {
     id: `best-${Date.now()}`,              // unique id for this route
      tag: "Best Value",
      transferType: "swap",
      inputAmount:amount,
      inputToken,
      outputToken,
      estimatedOutput: Number(bestQuote.outAmount) / Math.pow(10, TOKEN_DECIMALS[outputToken]),
      estimatedFee: (Number(bestQuote.outAmount) * bestQuote.feeBps) / 10000,
      estimatedTime: "~20s",
      jupiterQuote: bestQuote,
      meta: {
       label: bestQuote.routePlan.map((r: any) => r.swapInfo.label).join(" → "),
       reliable: true
      }
    }

    const routes : SeroutRoute[] = [fastRoute,cheapRoute, bestRoute]
    return routes
}