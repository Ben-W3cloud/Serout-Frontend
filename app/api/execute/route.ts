import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { buildTransferTransaction } from '@/lib/solana/transactions';
import { getSwapQuote, getSwapTransaction } from '@/lib/solana/swap';
import { executeMockBankPayout } from '@/lib/solana/bank';

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

    const userKey = new PublicKey(userPublicKey);

    switch (route) {
      case 'direct': {
        const { recipient, amount } = params;
        const tx = await buildTransferTransaction({
          from: userKey,
          to: new PublicKey(recipient),
          amount: parseFloat(amount),
        });
        return NextResponse.json({
          success: true,
          transaction: tx.serialize({ requireAllSignatures: false }).toString('base64'),
        });
      }

      case 'swap': {
        const { inputToken, outputToken, amount, slippageBps = 50 } = params;
        const quote = await getSwapQuote({
          inputMint: TOKEN_MINTS[inputToken.toUpperCase()] || inputToken,
          outputMint: TOKEN_MINTS[outputToken.toUpperCase()] || outputToken,
          amount: Math.floor(parseFloat(amount) * 1e9),
          slippageBps,
        });
        const { swapTransaction } = await getSwapTransaction(quote, userKey);
        return NextResponse.json({ success: true, transaction: swapTransaction });
      }

      case 'bank': {
        const { amount, currency = 'USD' } = params;
        const result = await executeMockBankPayout(parseFloat(amount), currency);
        return NextResponse.json({
          success: result.success,
          referenceId: result.referenceId,
          signature: result.signature,
          status: result.status,
          estimatedCompletion: result.estimatedCompletion,
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid route' }, { status: 400 });
    }
  } catch (error) {
    console.error('Execute API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Execution failed' },
      { status: 500 }
    );
  }
}
