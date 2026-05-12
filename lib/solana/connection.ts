import { Connection, clusterApiUrl, Commitment } from '@solana/web3.js';

const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet');
const COMMITMENT: Commitment = 'confirmed';

let connection: Connection | null = null;

export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(SOLANA_RPC, {
      commitment: COMMITMENT,
      confirmTransactionInitialTimeout: 60000,
    });
  }
  return connection;
}
