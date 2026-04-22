import { NextRequest, NextResponse } from 'next/server'
import { getJupiterQuote } from '@/lib/jupiter';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);

  const isBankTransfer = typeof body.destination === "object"
  const isSwap = typeof body.destination === "string" && body.sourceToken !== body.destinationToken
  const isDirect = typeof body.destination === "string" && body.sourceToken === body.destinationToken

  if (isBankTransfer) {
    return NextResponse.json({type : "bank", routes : []})
  }

  if (isDirect) {
    return NextResponse.json({type: "direct", routes : [] })
  }

  if (isSwap) {
    const quote = await getJupiterQuote(
    body.sourceToken,
    body.destinationToken,
    body.amount)

    console.log(quote)

    return NextResponse.json({type: "swap", routes : [] })
  }
  
  // 3. Based on transfer type, build routes differently
  
  // 4. Return the routes array
}