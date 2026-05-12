"use client";

import { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

type SignParams = {
  serializedTransaction: string;
  legacy: boolean;
};

type SignAndSendParams = SignParams & {
  rpcUrl: string;
  blockhash?: string;
  lastValidBlockHeight?: number;
};

export function useTransactionExecutor() {
  const { publicKey, signTransaction, connected } = useWallet();

  const signSerializedTransaction = useCallback(
    async ({ serializedTransaction, legacy }: SignParams): Promise<string> => {
      if (!connected || !publicKey || !signTransaction) {
        throw new Error("Wallet not connected. Please connect Phantom first.");
      }

      const tx = deserializeTransaction(serializedTransaction, legacy);
      const signed = await signTransaction(tx);
      return bytesToBase64(signed.serialize());
    },
    [connected, publicKey, signTransaction],
  );

  const signAndSendTransaction = useCallback(
    async ({
      serializedTransaction,
      rpcUrl,
      legacy,
      blockhash,
      lastValidBlockHeight,
    }: SignAndSendParams): Promise<string> => {
      if (!connected || !publicKey || !signTransaction) {
        throw new Error("Wallet not connected. Please connect Phantom first.");
      }

      const connection = new Connection(rpcUrl, "confirmed");
      const tx = deserializeTransaction(serializedTransaction, legacy);
      const signed = await signTransaction(tx);
      const signature = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
        maxRetries: 3,
      });

      if (blockhash && lastValidBlockHeight) {
        const confirmation = await connection.confirmTransaction(
          { signature, blockhash, lastValidBlockHeight },
          "confirmed",
        );

        if (confirmation.value.err) {
          throw new Error(
            `Transaction failed on-chain: ${JSON.stringify(confirmation.value.err)}`,
          );
        }
      }

      return signature;
    },
    [connected, publicKey, signTransaction],
  );

  return {
    connected,
    publicKey,
    signSerializedTransaction,
    signAndSendTransaction,
  };
}

function deserializeTransaction(serializedTransaction: string, legacy: boolean) {
  const bytes = base64ToBytes(serializedTransaction);
  return legacy
    ? Transaction.from(bytes)
    : VersionedTransaction.deserialize(bytes);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}
