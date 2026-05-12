import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { buildTransferTransaction, simulateTransfer } from '@/lib/solana/transactions';
import { getSwapQuote, getSwapTransaction, simulateSwapTransaction } from '@/lib/solana/swap';
import { simulateBankPayout } from '@/lib/solana/bank';

const TOKEN_MINTS: Record<string, string> = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { route, params, userPublicKey } = body;

    if (!route || !params || !userPublicKey) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    let userKey: PublicKey;
    try {
      userKey = new PublicKey(userPublicKey);
    } catch {
      return NextResponse.json({ error: 'Invalid public key' }, { status: 400 });
    }

    switch (route) {
      case 'direct': {
        const { recipient, amount } = params;
        if (!recipient || !amount) {
          return NextResponse.json({ error: 'Missing recipient or amount' }, { status: 400 });
        }
        try { new PublicKey(recipient); } catch {
          return NextResponse.json({ error: 'Invalid recipient' }, { status: 400 });
        }

        const tx = await buildTransferTransaction({
          from: userKey,
          to: new PublicKey(recipient),
          amount: parseFloat(amount),
        });
        const sim = await simulateTransfer(tx);
        return NextResponse.json({ route: 'direct', ...sim, estimatedAmount: parseFloat(amount) });
      }

      case 'swap': {
        const { inputToken, outputToken, amount, slippageBps = 50 } = params;
        if (!inputToken || !outputToken || !amount) {
          return NextResponse.json({ error: 'Missing swap params' }, { status: 400 });
        }

        const inputMint = TOKEN_MINTS[inputToken.toUpperCase()] || inputToken;
        const outputMint = TOKEN_MINTS[outputToken.toUpperCase()] || outputToken;

        const quote = await getSwapQuote({
          inputMint,
          outputMint,
          amount: Math.floor(parseFloat(amount) * 1e9),
          slippageBps,
        });

        const { swapTransaction } = await getSwapTransaction(quote, userKey);
        const sim = await simulateSwapTransaction(swapTransaction);

        return NextResponse.json({
          route: 'swap',
          ...sim,
          estimatedAmount: parseFloat(quote.outAmount) / 1e9,
          priceImpact: parseFloat(quote.priceImpactPct),
          slippage: slippageBps / 100,
        });
      }

      case 'bank': {
        const { amount, currency = 'USD' } = params;
        if (!amount) return NextResponse.json({ error: 'Missing amount' }, { status: 400 });
        const sim = await simulateBankPayout(parseFloat(amount), currency);
        return NextResponse.json({
          route: 'bank',
          success: sim.success,
          estimatedFee: sim.estimatedFee,
          estimatedAmount: sim.estimatedAmount,
          raw: sim,
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid route' }, { status: 400 });
    }
  } catch (error) {
    console.error('Simulate API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Simulation failed' },
      { status: 500 }
    );
  }
}
