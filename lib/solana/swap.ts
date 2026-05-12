import { PublicKey, Transaction } from '@solana/web3.js';
import axios from 'axios';
import { getConnection } from './connection';

const JUPITER_API = 'https://quote-api.jup.ag/v6';

export interface SwapQuoteRequest {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
}

export async function getSwapQuote(params: SwapQuoteRequest) {
  const { inputMint, outputMint, amount, slippageBps = 50 } = params;
  const url = new URL(`${JUPITER_API}/quote`);
  url.searchParams.set('inputMint', inputMint);
  url.searchParams.set('outputMint', outputMint);
  url.searchParams.set('amount', amount.toString());
  url.searchParams.set('slippageBps', slippageBps.toString());

  const response = await axios.get(url.toString(), { timeout: 10000 });
  return response.data;
}

export async function getSwapTransaction(
  quote: any,
  userPublicKey: PublicKey,
  wrapUnwrapSOL: boolean = true
) {
  const response = await axios.post(
    `${JUPITER_API}/swap`,
    {
      quoteResponse: quote,
      userPublicKey: userPublicKey.toString(),
      wrapAndUnwrapSol: wrapUnwrapSOL,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto',
    },
    { timeout: 15000 }
  );
  return response.data;
}

export async function simulateSwapTransaction(swapTransactionBase64: string) {
  try {
    const connection = getConnection();
    const transaction = Transaction.from(Buffer.from(swapTransactionBase64, 'base64'));
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      return {
        success: false,
        fee: 0,
        priceImpact: 0,
        error: JSON.stringify(simulation.value.err),
      };
    }

    return {
      success: true,
      fee: (simulation.value.unitsConsumed || 5000) / 1e9,
      priceImpact: 0,
    };
  } catch (error) {
    return {
      success: false,
      fee: 0,
      priceImpact: 0,
      error: error instanceof Error ? error.message : 'Swap simulation failed',
    };
  }
}

export function deserializeSwapTransaction(base64: string): Transaction {
  return Transaction.from(Buffer.from(base64, 'base64'));
}
