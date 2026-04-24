// ============================================================
// FILE LOCATION: app/api/payout/route.ts
//
// PURPOSE: Handles the simulated bank payout layer.
// After an onchain swap completes, this confirms the offchain
// bank transfer happened (mocked for hackathon).
// ============================================================

import { NextRequest, NextResponse } from "next/server"
import { Connection, clusterApiUrl } from "@solana/web3.js"

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Frontend sends: transaction signature + bank details
  const { signature, bankDetails, amount, gateway } = body

  if (!signature || !bankDetails) {
    return NextResponse.json(
      { success: false, error: "Missing signature or bank details" },
      { status: 400 }
    )
  }

  try {
    // Connect to Solana mainnet to verify the transaction landed
    const connection = new Connection(clusterApiUrl("mainnet-beta"))

    // Check if the transaction actually confirmed on Solana
    // This prevents fake payout requests
    const txInfo = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    })

    // If transaction not found, reject the payout request
    if (!txInfo) {
      return NextResponse.json(
        { success: false, error: "Transaction not confirmed on Solana" },
        { status: 400 }
      )
    }

    // Transaction confirmed — now simulate the bank payout
    // In production: call Flutterwave/Paystack/Monnify API here

    // Generate a realistic mock payout reference
    const reference = `SRT-${Date.now().toString(36).toUpperCase()}`

    // Simulate different processing times per gateway
    // In production this would be a real API call with real status
    const gatewayStatus: Record<string, string> = {
      "Flutterwave": "processing",
      "Paystack": "processing",
      "Monnify": "queued",
    }

    return NextResponse.json({
      success: true,
      payout: {
        // Reference number user can track
        reference,

        // Current status of the bank transfer
        status: gatewayStatus[gateway] ?? "processing",

        // Bank details for confirmation display
        bankName: bankDetails.bankName,
        accountName: bankDetails.accountName,
        accountNumber: bankDetails.accountNumber,

        // Amount in NGN that will be credited
        amount,

        // Which gateway is processing it
        gateway,

        // Timestamp
        initiatedAt: new Date().toISOString(),
      }
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
