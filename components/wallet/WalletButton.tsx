'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { cn, truncateAddress } from '@/lib/utils';

export function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <WalletMultiButton 
      className={cn(
        "glass-button !h-10 !px-4 !text-sm !font-medium",
        connected && "!bg-neon-green/20 !text-neon-green"
      )}
    >
      {connected && publicKey ? truncateAddress(publicKey.toString()) : 'Connect Wallet'}
    </WalletMultiButton>
  );
}
