// FILE LOCATION: components/chat/ChatContext.tsx
//
// WHAT CHANGED FROM BEFORE:
// - Added selectedRoute state — stores which route the user clicked
// - Added simulationResult state — stores result from /api/simulate
// - Added selectRoute() function — called when user clicks "Select Route"
// - selectRoute() calls /api/simulate automatically after selection
// - Added confirmTransaction() — called when user clicks "Confirm"
// - confirmTransaction() calls /api/execute then polls /api/transaction/:sig

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
  routes?: SeroutRoute[]
  transferType?: TransferType
  isLoading?: boolean
  simulation?: any      // holds simulation result when showing confirmation step
  confirmed?: boolean   // true after transaction completes
};

type ChatContextValue = {
  draft: string;
  messages: ChatMessage[];
  selectedRoute: SeroutRoute | null;   // currently selected route
  simulationResult: any | null;        // result from /api/simulate
  isSimulating: boolean;               // true while /api/simulate is loading
  isExecuting: boolean;                // true while /api/execute is running
  resetChat: () => void;
  sendMessage: () => Promise<void>;
  setDraft: (value: string) => void;
  selectRoute: (route: SeroutRoute) => Promise<void>;    // user clicks Select Route
  confirmTransaction: () => Promise<void>;               // user clicks Confirm
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SeroutRoute | null>(null);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Get wallet access — publicKey for fromAddress, signTransaction for execution
  const { publicKey, signTransaction } = useWallet();

  const resetChat = useCallback(() => {
    setDraft("");
    setMessages([]);
    setSelectedRoute(null);
    setSimulationResult(null);
  }, []);

  // Called when user sends a message
  const sendMessage = useCallback(async () => {
    const trimmedDraft = draft.trim();
    if (!trimmedDraft) return;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, role: "user", content: trimmedDraft },
    ]);
    setDraft("");

    // Add loading placeholder for agent response
    const loadingId = `loading-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: loadingId, role: "agent", content: "Analyzing your request...", isLoading: true }
    ])

    try {
      const fromAddress = publicKey?.toString() ?? ""
      const result = await processMessage(trimmedDraft, fromAddress)

      // Replace loading message with routes
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
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { id: loadingId, role: "agent", content: "Something went wrong. Please try again.", isLoading: false }
            : msg
        )
      );
    }
  }, [draft, publicKey]);

  // Called when user clicks "Select Route" on a RouteCard
  const selectRoute = useCallback(async (route: SeroutRoute) => {
    // Store the selected route
    setSelectedRoute(route)
    setIsSimulating(true)
    setSimulationResult(null)

    // Add a loading message while simulation runs
    const simLoadingId = `sim-loading-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: simLoadingId,
        role: "agent",
        content: `Simulating ${route.tag} route...`,
        isLoading: true,
      }
    ])

    try {
      // Call /api/simulate with the selected route
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route })
      })
      const data = await response.json()

      if (!data.success) throw new Error(data.error)

      // Store simulation result in state — used later by confirmTransaction
      setSimulationResult(data.simulation)

      // Replace loading message with simulation result
      // The simulation message has a special flag so the UI renders
      // a confirmation card instead of plain text
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === simLoadingId
            ? {
                id: simLoadingId,
                role: "agent",
                content: "Here's your simulation result. Review and confirm to proceed.",
                simulation: data.simulation,  // UI will render a SimulationCard
                isLoading: false,
              }
            : msg
        )
      )
    } catch (error: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === simLoadingId
            ? { id: simLoadingId, role: "agent", content: `Simulation failed: ${error.message}`, isLoading: false }
            : msg
        )
      )
    } finally {
      setIsSimulating(false)
    }
  }, [])

  // Called when user clicks "Confirm & Execute"
  const confirmTransaction = useCallback(async () => {
    // Can't execute without these
    if (!selectedRoute || !simulationResult || !publicKey) return

    setIsExecuting(true)

    // Add executing loading message
    const execLoadingId = `exec-loading-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: execLoadingId, role: "agent", content: "Executing transaction...", isLoading: true }
    ])

    try {
      // Step 1 — Call /api/execute to build the transaction
      const executeResponse = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulation: simulationResult,
          route: selectedRoute,
          fromAddress: publicKey.toString(),
        })
      })
      const executeData = await executeResponse.json()
      if (!executeData.success) throw new Error(executeData.error)

      // Step 2 — For swap: sign and send the transaction
      // The wallet adapter handles this — user approves in Phantom popup
      let signature = ""

      if (selectedRoute.transferType === "swap" && executeData.swapTransaction) {
        // Deserialize the transaction Jupiter built
        const { VersionedTransaction } = await import("@solana/web3.js")
        const transactionBuffer = Buffer.from(executeData.swapTransaction, "base64")
        const transaction = VersionedTransaction.deserialize(transactionBuffer)

        // Ask user to sign it via Phantom — this opens the popup
        if (!signTransaction) throw new Error("Wallet not connected")
        const signedTx = await signTransaction(transaction)

        // Broadcast the signed transaction to Solana
        const { Connection, clusterApiUrl } = await import("@solana/web3.js")
        const connection = new Connection(clusterApiUrl("mainnet-beta"))
        signature = await connection.sendRawTransaction(signedTx.serialize())
      }

      // Step 3 — For bank routes, call /api/payout after execution
      if (selectedRoute.transferType === "bank" && signature) {
        await fetch("/api/payout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signature,
            bankDetails: selectedRoute.meta,
            amount: simulationResult.outputAmount,
            gateway: selectedRoute.meta.label.split(" → ")[0],
          })
        })
      }

      // Step 4 — Poll /api/transaction/:signature for confirmation
      // We check every 3 seconds until confirmed or failed
      if (signature) {
        const pollInterval = setInterval(async () => {
          const statusResponse = await fetch(`/api/transaction/${signature}`)
          const statusData = await statusResponse.json()

          if (statusData.status === "confirmed" || statusData.status === "failed") {
            // Stop polling
            clearInterval(pollInterval)

            // Replace loading message with final result
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === execLoadingId
                  ? {
                      id: execLoadingId,
                      role: "agent",
                      content: statusData.status === "confirmed"
                        ? `Transaction confirmed! View on Solscan: ${statusData.explorerUrl}`
                        : "Transaction failed. Please try again.",
                      confirmed: statusData.status === "confirmed",
                      isLoading: false,
                    }
                  : msg
              )
            )
            setIsExecuting(false)
          }
        }, 3000) // poll every 3 seconds
      } else {
        // Bank/direct — no signature polling needed, just show success
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === execLoadingId
              ? {
                  id: execLoadingId,
                  role: "agent",
                  content: selectedRoute.transferType === "bank"
                    ? `Bank payout initiated! Reference: ${executeData.payout?.reference}`
                    : "Transfer complete!",
                  confirmed: true,
                  isLoading: false,
                }
              : msg
          )
        )
        setIsExecuting(false)
      }

    } catch (error: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === execLoadingId
            ? { id: execLoadingId, role: "agent", content: `Execution failed: ${error.message}`, isLoading: false }
            : msg
        )
      )
      setIsExecuting(false)
    }
  }, [selectedRoute, simulationResult, publicKey, signTransaction])

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
    [draft, messages, selectedRoute, simulationResult, isSimulating, isExecuting, resetChat, sendMessage, selectRoute, confirmTransaction],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
}