import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { message, fromAddress } = body

  // TODO: Replace this with real Claude/OpenAI API call
  // It should parse message and return structured transfer inten
  if (!message){
    return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
  }

  // Hardcoded placeholder that mimics what the AI would return
  const parsedIntent = {
    amount: 1,
    sourceToken: "SOL",
    destinationToken: "USDC",
    destination: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    fromAddress: fromAddress
  }

  return NextResponse.json({ 
    success: true,
    intent: parsedIntent,
    originalMessage: message
  })
}