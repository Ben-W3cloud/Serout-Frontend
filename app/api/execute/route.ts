// FILE LOCATION: app/api/execute/route.ts
//
// PURPOSE: Takes the confirmed simulation and executes the actual transaction.
// For swaps — builds the Jupiter transaction and returns it unsigned.
// For direct — builds a simple SOL/token transfer transaction.
// For bank — triggers the mock payout flow.
//
// IMPORTANT: This route NEVER signs the transaction.
// Signing always happens on the FRONTEND using the user's wallet.
// This route just builds and returns the unsigned transaction.

import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Frontend sends: the simulation result + the user's wallet address
  const { simulation, route, fromAddress } = body

  // Guard — all three are required
  if (!simulation || !route || !fromAddress) {
    return NextResponse.json(
      { success: false, error: "Missing simulation, route, or fromAddress" },
      { status: 400 }
    )
  }

  try {

    // SWAP EXECUTION
    // Ask Jupiter to build the actual swap transaction using the fresh quote
    if (route.transferType === "swap") {

      // Jupiter's /order endpoint gave us a quote
      // Now we call /execute concept — we POST to Jupiter's swap endpoint
      // with the quote + user's wallet address
      // Jupiter returns a serialized (pre-built) transaction ready to be signed

      const jupiterSwapResponse = await fetch("https://api.jup.ag/swap/v2/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Your Jupiter API key from .env.local
          "Authorization": `Bearer ${process.env.JUPITER_API_KEY}`
        },
        body: JSON.stringify({
          // The fresh quote stored in simulation
          quoteResponse: simulation.jupiterQuote,

          // The user's wallet — Jupiter needs this to build the transaction
          userPublicKey: fromAddress,

          // Wrap/unwrap SOL automatically if needed
          wrapAndUnwrapSol: true,
        })
      })

      if (!jupiterSwapResponse.ok) {
        throw new Error(`Jupiter swap build failed: ${jupiterSwapResponse.status}`)
      }

      const swapData = await jupiterSwapResponse.json()

      // Return the serialized transaction to the frontend
      // The frontend will pass this to the wallet adapter to sign
      return NextResponse.json({
        success: true,
        type: "swap",

        // This is the unsigned transaction — a base64 encoded string
        // Frontend does: wallet.signTransaction(deserialize(swapTransaction))
        swapTransaction: swapData.swapTransaction,

        // Pass simulation data through for display after execution
        simulation,
      })
    }

    // DIRECT TRANSFER EXECUTION
    // For direct transfers we return the transfer parameters
    // The frontend uses @solana/web3.js to build and sign the transaction itself
    if (route.transferType === "direct") {
      return NextResponse.json({
        success: true,
        type: "direct",

        // The frontend needs these to build the SystemProgram.transfer transaction
        transfer: {
          fromAddress,
          toAddress: route.jupiterQuote?.destination ?? body.destination,
          amount: route.inputAmount,
          token: route.inputToken,
        },
        simulation,
      })
    }

    // BANK PAYOUT EXECUTION
    // Trigger the mock payout — in real life this calls Flutterwave/Paystack API
    if (route.transferType === "bank") {
      return NextResponse.json({
        success: true,
        type: "bank",

        // Mock payout confirmation
        // In production: call payout provider API here
        payout: {
          status: "processing",
          reference: `SEROUT-${Date.now()}`,
          gateway: route.meta.label.split(" → ")[0], // e.g. "Flutterwave"
          estimatedTime: route.estimatedTime,
        },
        simulation,
      })
    }

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