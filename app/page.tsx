import { ChatInterface } from '@/components/chat/ChatInterface';
import { WalletButton } from '@/components/wallet/WalletButton';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-panel border-b border-glass-border m-4 mb-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold neon-text">Serout</h1>
          </div>
          <WalletButton />
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <ChatInterface />
      </div>
    </main>
  );
}