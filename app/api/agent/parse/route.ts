import { NextRequest, NextResponse } from "next/server";
import { NIGERIAN_BANKS } from "@/types/routes";

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { message, fromAddress } = body

  if (!message){
    return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
  }

  const amount = Number(message.match(/[\d.]+/)?.[0] ?? "1")

  const hasSOL = message.toUpperCase().includes("SOL")
  const hasUSDC = message.toUpperCase().includes("USDC")
  const hasUSDT = message.toUpperCase().includes("USDT")
  const isBankTransfer = /\b\d{10}\b/.test(message)

  // detect source token — whichever one is mentioned
  const sourceToken = hasUSDC ? "USDC" : hasUSDT ? "USDT" : "SOL"

  // detect destination token
  // if bank transfer → stays as sourceToken (we convert to NGN on backend)
  // if message says "swap" or mentions a different token → different token
  const isSwap = message.toUpperCase().includes("SWAP") || 
    (hasSOL && hasUSDC) || (hasSOL && hasUSDT)
  const destinationToken = isSwap ? (hasSOL && !hasUSDC ? "USDC" : "SOL"): sourceToken

  // build destination
  // if bank — extract the 10 digit number from message
  const accountNumber = message.match(/\b\d{10}\b/)?.[0]
  const destination = isBankTransfer 
    ? { accountNumber, bankName: NIGERIAN_BANKS.find(bank => message.toLowerCase().includes(bank.toLowerCase())) || "Unknown Bank", accountName: "Account Holder" }
    : message.split(" ").find((word: string) => word.length > 30) // wallet addresses are long strings

  // TODO: Replace this with real Claude/OpenAI API call
  // It should parse message and return structured transfer intent
  // Hardcoded placeholder that mimics what the AI would return
  const parsedIntent = {
    amount,
    sourceToken,
    destinationToken,
    destination,
    fromAddress
}

  return NextResponse.json({ 
    success: true,
    intent: parsedIntent,
    originalMessage: message
  })
}