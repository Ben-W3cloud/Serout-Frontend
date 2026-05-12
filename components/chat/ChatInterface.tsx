'use client';

import { useState, useRef, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { Send, Loader2 } from 'lucide-react';
import { ChatMessage, RouteOption, SimulationResult, ExecutionResult } from '@/types';
import { generateId, cn } from '@/lib/utils';
import { MessageBubble } from './MessageBubble';
import { RouteSelector } from './RouteSelector';
import { SimulationResult as SimResultComponent } from './SimulationResult';

export function ChatInterface() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome',
    role: 'assistant',
    content: 'Welcome to Serout. Connect your wallet and tell me what you\'d like to do. Try "send 0.1 SOL to ADDRESS" or "swap SOL to USDC".',
    timestamp: Date.now(),
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg: ChatMessage) => setMessages(prev => [...prev, msg]);
  const updateMessage = (id: string, updates: Partial<ChatMessage>) => 
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (!publicKey) {
      addMessage({ id: generateId(), role: 'assistant', content: 'Please connect your wallet first.', timestamp: Date.now() });
      return;
    }

    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: input.trim(), timestamp: Date.now() };
    addMessage(userMsg);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      };

      if (data.intent !== 'GENERAL_CHAT' && data.confidence > 0.5) {
        assistantMsg.routes = buildRoutes(data.intent, data.params);
      }

      addMessage(assistantMsg);
    } catch {
      addMessage({ id: generateId(), role: 'assistant', content: 'Sorry, I had trouble understanding that.', timestamp: Date.now() });
    } finally {
      setIsLoading(false);
    }
  };

  const buildRoutes = (intent: string, params: any): RouteOption[] => {
    const amt = params?.amount || 0.1;
    return [
      {
        id: 'direct', title: 'Direct Transfer', description: 'Send SOL or tokens on-chain',
        icon: 'send', estimatedAmount: `${amt} SOL`, estimatedFee: '~0.000005 SOL', estimatedTime: '~5s',
        params: { amount: amt, token: params?.token || 'SOL', recipient: params?.recipient || '' }, enabled: true,
      },
      {
        id: 'swap', title: 'Token Swap', description: 'Swap via Jupiter DEX',
        icon: 'swap', estimatedAmount: `${amt} SOL worth`, estimatedFee: '~0.0005 SOL', estimatedTime: '~10s',
        params: { inputToken: params?.inputToken || 'SOL', outputToken: params?.outputToken || 'USDC', amount: amt, slippageBps: 50 }, enabled: true,
      },
      {
        id: 'bank', title: 'Bank Payout', description: 'Off-ramp to bank (mock)',
        icon: 'bank', estimatedAmount: `$${(amt * 145).toFixed(2)}`, estimatedFee: '~0.001 SOL', estimatedTime: '1-3 days',
        params: { amount: amt, currency: params?.currency || 'USD', accountNumber: params?.accountNumber || '' }, enabled: true,
      },
    ];
  };

  const handleRouteSelect = async (msgId: string, route: RouteOption) => {
    updateMessage(msgId, { pending: true });
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ route: route.id, params: route.params, userPublicKey: publicKey?.toString() }),
      });
      const sim: SimulationResult = await res.json();
      updateMessage(msgId, {
        simulation: sim,
        pending: false,
        content: `I've prepared the ${route.title} route. Review the simulation and confirm to execute.`,
      });
    } catch {
      updateMessage(msgId, { pending: false, content: 'Simulation failed. Please try again.' });
    }
  };

  const handleExecute = async (msgId: string, routeId: string) => {
    if (!signTransaction) {
      updateMessage(msgId, { pending: false, content: 'Wallet does not support transaction signing.' });
      return;
    }

    updateMessage(msgId, { pending: true });
    try {
      const msg = messages.find(m => m.id === msgId);
      const route = msg?.routes?.find(r => r.id === routeId);
      if (!route) throw new Error('Route not found');

      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ route: routeId, params: route.params, userPublicKey: publicKey?.toString() }),
      });
      const result = await res.json();

      if (result.success && result.transaction) {
        const tx = Transaction.from(Buffer.from(result.transaction, 'base64'));
        const signed = await signTransaction(tx);
        const sig = await connection.sendRawTransaction(signed.serialize(), { maxRetries: 3 });
        await connection.confirmTransaction(sig, 'confirmed');

        updateMessage(msgId, {
          execution: { success: true, signature: sig, confirmation: 'confirmed' },
          pending: false,
          content: `Executed! Signature: ${sig.slice(0, 16)}...`,
        });
      } else if (result.success && routeId === 'bank') {
        updateMessage(msgId, {
          execution: { success: true, signature: result.signature, confirmation: result.referenceId },
          pending: false,
          content: `Bank payout initiated! Ref: ${result.referenceId}`,
        });
      } else {
        throw new Error(result.error || 'Execution failed');
      }
    } catch (err) {
      updateMessage(msgId, {
        pending: false,
        content: `Failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] glass-panel overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id}>
            <MessageBubble message={msg} />
            {msg.routes && !msg.simulation && (
              <RouteSelector routes={msg.routes} onSelect={(r) => handleRouteSelect(msg.id, r)} disabled={msg.pending || false} />
            )}
            {msg.simulation && (
              <SimResultComponent
                simulation={msg.simulation}
                onExecute={() => handleExecute(msg.id, msg.simulation!.route)}
                onCancel={() => updateMessage(msg.id, { simulation: undefined })}
                disabled={msg.pending || false}
              />
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Serout is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-glass-border p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a command..."
            className="flex-1 bg-glass-100 border border-glass-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={cn("glass-button p-3 transition-all", input.trim() && "hover:bg-neon-cyan/20 text-neon-cyan")}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
