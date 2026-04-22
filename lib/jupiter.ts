// imports needed
import { toSmallestUnit, SOLANA_TOKEN_MINTS } from "@/constants/token"
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
   const JUP_QUOTE_API = "https://quote-api.jup.ag/v6/quote";

   const url = `${JUP_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${newAmount}&slippageBps=${slippageBps}`;

  // 4. fetch it
   const quote = await fetch(url)
   if (!quote.ok) {
      throw new Error(`Jupiter quote failed: ${quote.status}`)
    }
   const response = await quote.json()

  // 5. return the json response
  return response
}

// export async function generateSwapRoutes(
//   inputToken: string,
//   outputToken: string,
//   amount: number
// ): Promise< SeroutRoute[]> {

//   // call getJupiterQuote 3 times with different slippageBps
//   // hint: you'll need to update getJupiterQuote to accept slippage as a parameter

//   const [fastQuote, cheapQuote, bestQuote] = await Promise.all([
//     getJupiterQuote(inputToken, outputToken, amount, 100),
//     getJupiterQuote(inputToken, outputToken, amount, 10),
//     getJupiterQuote(inputToken, outputToken, amount, 50),
//   ])

  // now build a SeroutRoute object for each quote
  // for fastQuote, tag = "Fastest"
//   const fastRoute : SeroutRoute = {
//      id: `fast-${Date.now()}`,              // unique id for this route
//       tag: "Fastest",
//       transferType: "swap",
//       inputAmount: ,
//       inputToken: string,
//       outputToken: string,
//       estimatedOutput: number, 
//       estimatedFee: number,    
//       estimatedTime: string,   
//       jupiterQuote?: any,      
//       meta: {
//         label: string         // human readable e.g. "Swap via Orca → Raydium"
//         reliable: boolean
//       }
//   }
//   // for cheapQuote, tag = "Cheapest"
//   // for bestQuote, tag = "Best Value"
// }
