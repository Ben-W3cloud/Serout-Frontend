/* direct is for wallet to wallet, swap is for token swap, bank is for tx which involve local Nigerian banks */

export type TransferType = "direct" | "swap" | "bank";

export type RouteTag = "Fastest" | "Cheapest" | "Best Value" ;

export interface SeroutRoute {
  id: string              // unique id for this route
  tag: RouteTag
  transferType: TransferType
  inputAmount: number
  inputToken: string
  outputToken: string
  estimatedOutput: number 
  estimatedFee: number    
  estimatedTime: string   
  jupiterQuote?: any      
  meta: {
    label: string         // human readable e.g. "Swap via Orca → Raydium"
    reliable: boolean
  }
}

export const NIGERIAN_BANKS = ["GTBank", "Access", "Zenith", "UBA", "First Bank", "Kuda", "Opay", "Wema", "Fidelity", "Polaris", "Standard Chartered", "Union Bank"]
// // wallet transfer
// { "destination": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" }

// // bank transfer
// { "destination": { "accountNumber": "0123456789", "bankName": "GTBank", "accountName": "John Doe" } }