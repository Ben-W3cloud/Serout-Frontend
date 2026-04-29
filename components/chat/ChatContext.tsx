// FILE LOCATION: components/chat/ChatContext.tsx
// REPLACE YOUR ENTIRE EXISTING FILE WITH THIS

"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { processMessage } from "@/lib/agent";
import type { SeroutRoute } from "@/types/routes";
import type { TransferType } from "@/types/routes";

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
  routes?: SeroutRoute[];
  transferType?: TransferType;
  isLoading?: boolean;
  simulation?: any;
  confirmed?: boolean;
};

type ChatContextValue = {
  draft: string;
  messages: ChatMessage[];
  selectedRoute: SeroutRoute | null;
  simulationResult: any | null;
  isSimulating: boolean;
  isExecuting: boolean;
  resetChat: () => void;
  sendMessage: () => Promise<void>;
  setDraft: (value: string) => void;
  selectRoute: (route: SeroutRoute) => Promise<void>;
  confirmTransaction: () => Promise<void>;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SeroutRoute | null>(null);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // ─── NEW: store the parsed intent so confirmTransaction
  // can access the original destination address the user typed ───
  const [currentIntent, setCurrentIntent] = useState<any | null>(null);

  const { publicKey, signTransaction } = useWallet();

  const resetChat = useCallback(() => {
    setDraft("");
    setMessages([]);
    setSelectedRoute(null);
    setSimulationResult(null);
    setCurrentIntent(null); // ← clear intent on reset
  }, []);

  // ─── SEND MESSAGE ─────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const trimmedDraft = draft.trim();
    if (!trimmedDraft) return;

    // 1. Add user message immediately
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, role: "user", content: trimmedDraft },
    ]);
    setDraft("");

    // 2. Add agent loading placeholder
    const loadingId = `loading-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        role: "agent",
        content: "Analyzing your request...",
        isLoading: true,
      },
    ]);

    try {
      const fromAddress = publicKey?.toString() ?? "";
      const result = await processMessage(trimmedDraft, fromAddress);

      // ─── NEW: save the parsed intent for use during execution ───
      setCurrentIntent(result.intent);

      // 3. Replace loading with routes
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
              id: loadingId,
              role: "agent",
              content: `I found ${result.routes.length} routes for your transfer. Select one to simulate.`,
              routes: result.routes,
              transferType: result.type,
              isLoading: false,
            }
            : msg
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
              id: loadingId,
              role: "agent",
              content: "Something went wrong. Please try again.",
              isLoading: false,
            }
            : msg
        )
      );
    }
  }, [draft, publicKey]);

  // ─── SELECT ROUTE → TRIGGER SIMULATION ───────────────────────
  const selectRoute = useCallback(async (route: SeroutRoute) => {
    setSelectedRoute(route);
    setIsSimulating(true);
    setSimulationResult(null);

    const simLoadingId = `sim-loading-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: simLoadingId,
        role: "agent",
        content: `Simulating ${route.tag} route...`,
        isLoading: true,
      },
    ]);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      setSimulationResult(data.simulation);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === simLoadingId
            ? {
              id: simLoadingId,
              role: "agent",
              content:
                "Here's your simulation result. Review and confirm to proceed.",
              simulation: data.simulation,
              isLoading: false,
            }
            : msg
        )
      );
    } catch (error: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === simLoadingId
            ? {
              id: simLoadingId,
              role: "agent",
              content: `Simulation failed: ${error.message}`,
              isLoading: false,
            }
            : msg
        )
      );
    } finally {
      setIsSimulating(false);
    }
  }, []);

  // ─── CONFIRM & EXECUTE ────────────────────────────────────────
  const confirmTransaction = useCallback(async () => {
    if (!selectedRoute || !simulationResult || !publicKey) return;

    // Guard — wallet must be connected and able to sign
    if (!signTransaction) {
      alert("Please connect your wallet before executing.");
      return;
    }

    setIsExecuting(true);

    const execLoadingId = `exec-loading-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: execLoadingId,
        role: "agent",
        content: "Executing transaction...",
        isLoading: true,
      },
    ]);

    try {
      const fromAddress = publicKey.toString();

      // ── Step 1: Call /api/execute to get transaction data ──────
      const executeResponse = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulation: simulationResult,
          route: selectedRoute,
          fromAddress,
        }),
      });
      const executeData = await executeResponse.json();
      if (!executeData.success) throw new Error(executeData.error);

      let signature = "";

      // ══════════════════════════════════════════════════════════
      // SWAP EXECUTION
      // Jupiter builds the transaction on the server (/api/execute)
      // and returns it as a base64 string. We deserialize it here,
      // ask the user to sign it via Phantom, then broadcast it.
      // ══════════════════════════════════════════════════════════
      if (
        selectedRoute.transferType === "swap" &&
        executeData.swapTransaction
      ) {
        // Dynamically import to avoid SSR issues
        const { VersionedTransaction, Connection } = await import(
          "@solana/web3.js"
        );

        // Deserialize the base64 transaction Jupiter returned
        const transactionBuffer = Buffer.from(
          executeData.swapTransaction,
          "base64"
        );
        const transaction = VersionedTransaction.deserialize(transactionBuffer);

        // Open Phantom popup — user reviews and approves the swap
        const signedTx = await signTransaction(transaction as any);

        // Connect to devnet and broadcast the signed transaction
        // IMPORTANT: Change "devnet" to "mainnet-beta" for production
        const connection = new Connection(
          "https://api.devnet.solana.com",
          "confirmed"
        );
        signature = await connection.sendRawTransaction(signedTx.serialize(), {
          // Skip preflight for speed — the simulation already verified it
          skipPreflight: false,
          preflightCommitment: "confirmed",
        });
      }

      // ══════════════════════════════════════════════════════════
      // DIRECT TRANSFER EXECUTION
      // No Jupiter involved. We build a simple SOL transfer
      // transaction here on the client using SystemProgram.transfer,
      // sign it with the wallet, and broadcast it to Solana.
      // ══════════════════════════════════════════════════════════
      if (selectedRoute.transferType === "direct") {
        const {
          SystemProgram,
          Transaction,
          PublicKey,
          Connection,
        } = await import("@solana/web3.js");

        // Connect to devnet
        // IMPORTANT: Change to "https://api.mainnet-beta.solana.com" for production
        const connection = new Connection(
          "https://api.devnet.solana.com",
          "confirmed"
        );

        // The destination address comes from the original parsed intent
        // currentIntent.destination is the wallet address the user typed
        const destinationAddress = currentIntent?.destination;
        if (!destinationAddress || typeof destinationAddress !== "string") {
          throw new Error("Invalid destination address");
        }

        // Convert SOL amount to lamports (1 SOL = 1,000,000,000 lamports)
        const lamports = Math.round(simulationResult.inputAmount * 1_000_000_000);

        // Build the transfer transaction
        // SystemProgram.transfer moves SOL between two wallets
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(fromAddress),   // sender's wallet
            toPubkey: new PublicKey(destinationAddress), // recipient's wallet
            lamports,                                  // amount in lamports
          })
        );

        // Solana requires a recent blockhash to prevent replay attacks
        // Think of it as a transaction timestamp
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new PublicKey(fromAddress);

        // Open Phantom popup for user to approve
        const signedTx = await signTransaction(transaction);

        // Broadcast to Solana network
        signature = await connection.sendRawTransaction(signedTx.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        });

        // Wait for confirmation before reporting success
        // This ensures the transaction actually landed
        await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        });
      }

      // ── Step 3: Bank payout ────────────────────────────────────
      // Only runs after an onchain swap that ends in a bank payout
      if (selectedRoute.transferType === "bank" && signature) {
        await fetch("/api/payout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signature,
            bankDetails: currentIntent?.destination,
            amount: simulationResult.outputAmount,
            gateway: selectedRoute.meta.label.split(" → ")[0],
          }),
        });
      }

      // ── Step 4: Poll for onchain confirmation ──────────────────
      // For swap and direct — poll every 3 seconds until confirmed
      if (signature) {
        const pollInterval = setInterval(async () => {
          const statusResponse = await fetch(
            `/api/transaction/${signature}`
          );
          const statusData = await statusResponse.json();

          if (
            statusData.status === "confirmed" ||
            statusData.status === "failed"
          ) {
            clearInterval(pollInterval);

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === execLoadingId
                  ? {
                    id: execLoadingId,
                    role: "agent",
                    content:
                      statusData.status === "confirmed"
                        ? `✅ Transaction confirmed! View on Solscan: ${statusData.explorerUrl}`
                        : "❌ Transaction failed. Please try again.",
                    confirmed: statusData.status === "confirmed",
                    isLoading: false,
                  }
                  : msg
              )
            );
            setIsExecuting(false);
          }
        }, 3000);
      } else {
        // Bank mock — no signature, show payout reference
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === execLoadingId
              ? {
                id: execLoadingId,
                role: "agent",
                content:
                  selectedRoute.transferType === "bank"
                    ? `✅ Bank payout initiated! Reference: ${executeData.payout?.reference}`
                    : "✅ Transfer complete!",
                confirmed: true,
                isLoading: false,
              }
              : msg
          )
        );
        setIsExecuting(false);
      }
    } catch (error: any) {
      // If user rejected in Phantom, show a friendly message
      const message = error.message?.includes("rejected")
        ? "Transaction rejected in wallet."
        : `Execution failed: ${error.message}`;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === execLoadingId
            ? {
              id: execLoadingId,
              role: "agent",
              content: message,
              isLoading: false,
            }
            : msg
        )
      );
      setIsExecuting(false);
    }
  }, [selectedRoute, simulationResult, publicKey, signTransaction, currentIntent]);

  const value = useMemo(
    () => ({
      draft,
      messages,
      selectedRoute,
      simulationResult,
      isSimulating,
      isExecuting,
      resetChat,
      sendMessage,
      setDraft,
      selectRoute,
      confirmTransaction,
    }),
    [
      draft,
      messages,
      selectedRoute,
      simulationResult,
      isSimulating,
      isExecuting,
      resetChat,
      sendMessage,
      selectRoute,
      confirmTransaction,
    ]
  );

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
}