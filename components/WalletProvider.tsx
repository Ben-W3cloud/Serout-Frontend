"use client"

import { FC, ReactNode, useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"

// default styles for the wallet modal
import "@solana/wallet-adapter-react-ui/styles.css"

export const SolanaWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  
  const endpoint = "https://api.mainnet-beta.solana.com"
  
  const wallets = useMemo(() => [], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}