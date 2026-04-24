import { NextRequest, NextResponse } from 'next/server'
import { generateSwapRoutes } from '@/lib/jupiter';
import { generateDirectRoutes } from '@/lib/transfer';
import { generateBankRoutes } from '@/lib/bank';

// fromAddress: publicKey?.toString()

export async function POST(req: NextRequest) { 
  const body = await req.json();
  console.log(body);

  const isBankTransfer = typeof body.destination === "object"
  const isSwap = typeof body.destination === "string" && body.sourceToken !== body.destinationToken
  const isDirect = typeof body.destination === "string" && body.sourceToken === body.destinationToken

  if (isBankTransfer) {
    const routes = generateBankRoutes(
        body.amount,
        body.sourceToken,
        body.destination
    )
    return NextResponse.json({type : "bank", routes})
  }

  if (isDirect) {
    const routes = generateDirectRoutes(
        body.sourceToken, 
        body.amount, 
        body.fromAddress,
        body.destination
    )
    console.log(routes)
    return NextResponse.json({type: "direct", routes})
  }

  if (isSwap) {
    const routes = await generateSwapRoutes(
    body.sourceToken,
    body.destinationToken,
    body.amount)

    console.log(routes)
    return NextResponse.json({type: "swap", routes })
  }
}