import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", isUser ? "bg-neon-purple/20" : "bg-neon-cyan/20")}>
        {isUser ? <User className="w-4 h-4 text-neon-purple" /> : <Bot className="w-4 h-4 text-neon-cyan" />}
      </div>
      <div className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm", isUser ? "bg-neon-purple/10 border border-neon-purple/20 text-white" : "bg-glass-200 border border-glass-border text-slate-200")}>
        {message.content}
      </div>
    </div>
  );
}
