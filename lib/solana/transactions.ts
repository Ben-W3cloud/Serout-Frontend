import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { getConnection } from './connection';

export interface TransferInstruction {
  from: PublicKey;
  to: PublicKey;
  amount: number;
}

export async function buildTransferTransaction(
  params: TransferInstruction
): Promise<Transaction> {
  const { from, to, amount } = params;
  const transaction = new Transaction();

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const connection = getConnection();
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = from;
  (transaction as any).lastValidBlockHeight = lastValidBlockHeight;

  return transaction;
}

export async function simulateTransfer(transaction: Transaction) {
  try {
    const connection = getConnection();
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      return {
        success: false,
        fee: 0,
        logs: simulation.value.logs || [],
        error: JSON.stringify(simulation.value.err),
      };
    }

    return {
      success: true,
      fee: (simulation.value.fee || 5000) / LAMPORTS_PER_SOL,
      logs: simulation.value.logs || [],
    };
  } catch (error) {
    return {
      success: false,
      fee: 0,
      error: error instanceof Error ? error.message : 'Simulation failed',
    };
  }
}
