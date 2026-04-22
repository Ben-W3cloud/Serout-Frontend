
//Mapping of Solana token symbols to their Mainnet Mint Addresses.

export const SOLANA_TOKEN_MINTS: Record<string, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaDCSE7sh5PBxp7vHmzsAwpP6Xv1G8Y2L8Nvw",
};

export const TOKEN_DECIMALS: Record<string, number> = {
  SOL: 9,
  USDC: 6,
  USDT: 6
};

export function toSmallestUnit(amount: number, token: string): number {
  const decimals = TOKEN_DECIMALS[token];
  let newAmount = amount * ( 10**decimals);
  return newAmount;
}