import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection } from "@solana/web3.js"

export function useWalletBalance() {
    const { publicKey, connected } = useWallet()
    const [balance, setBalance] = useState<number | null>(null)

    useEffect(() => {
        if (!publicKey || !connected) return

        const connection = new Connection("https://api.devnet.solana.com")

        connection.getBalance(publicKey).then((lamports) => {
            setBalance(lamports / 1_000_000_000)
        })
    }, [publicKey, connected])

    return balance
}