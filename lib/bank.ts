import { SeroutRoute } from "@/types/routes";
import { maskTenDigits } from "@/constants/token";

export function generateBankRoutes(
  amount: number,
  token: string,
  bankDetails: {
    accountNumber: string
    bankName: string
    accountName: string
  }
): SeroutRoute[] {
    const MOCK_NGN_RATE = 1600 // 1 USDC ≈ 1600 NGN

    const fastRoute : SeroutRoute = {
          id: `fast-${Date.now()}`,              // unique id for this route
          tag: "Fastest",
          transferType: "bank",
          inputAmount:amount,
          inputToken: token,
          outputToken: "NGN",
          estimatedOutput: (amount * MOCK_NGN_RATE) - 150, // assuming a flat fee of 150 NGN for bank transfers
          estimatedFee: 150,
          estimatedTime: "~2mins",
          jupiterQuote: undefined,
          meta: {
           label: `Bank Transfer to ${bankDetails.bankName} (${maskTenDigits(bankDetails.accountNumber)}) via Flutterwave`,
           reliable: false
          }
        }
    
        // for cheapRoute, tag = "Cheapest"
        const cheapRoute : SeroutRoute = {
         id: `cheap-${Date.now()}`,              // unique id for this route
          tag: "Cheapest",
          transferType: "bank",
          inputAmount:amount,
          inputToken:token,
          outputToken: "NGN",
          estimatedOutput: (amount * MOCK_NGN_RATE) -50 , // assuming a flat fee of 50 NGN for bank transfers
          estimatedFee: 50,
          estimatedTime: "~7mins",
          jupiterQuote:undefined,
          meta: {
           label: `Bank Transfer to ${bankDetails.bankName} (${maskTenDigits(bankDetails.accountNumber)}) via Paystack`,
           reliable: true
          }
        }
    
        // for bestRoute, tag = "Best Value"
        const bestRoute : SeroutRoute = {
         id: `best-${Date.now()}`,              // unique id for this route
          tag: "Best Value",
          transferType: "bank",
          inputAmount:amount,
          inputToken:token,
          outputToken: "NGN",
          estimatedOutput: (amount * MOCK_NGN_RATE) - 100, // assuming a flat fee of 100 NGN for bank transfers
          estimatedFee: 100,
          estimatedTime: "~5mins",
          jupiterQuote:undefined,
          meta: {
           label: `Bank Transfer to ${bankDetails.bankName} (${maskTenDigits(bankDetails.accountNumber)}) via Monnify`,
           reliable: true
          }
        }
    
        const routes : SeroutRoute[] = [fastRoute,cheapRoute, bestRoute]
        return routes
}
