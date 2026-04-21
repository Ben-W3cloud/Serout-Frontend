"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { InputBar } from "@/components/chat/InputBar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useChat } from "@/components/chat/ChatContext";

export default function ChatPage() {
  const { messages } = useChat();

  return (
    <>
      <ChatContainer>
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-1 items-center justify-center">
            <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
              <span className="rounded-full bg-surface-container/50 px-3 py-1 text-xs font-medium text-on-surface-variant/50 backdrop-blur-sm">
                Fresh Chat
              </span>
              <h1 className="mt-6 font-headline text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
                Start a new conversation
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-on-surface-variant">
                Enter a prompt below to begin a new Serout session.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <span className="rounded-full bg-surface-container/50 px-3 py-1 text-xs font-medium text-on-surface-variant/50 backdrop-blur-sm">
                Current Session
              </span>
            </div>
            {messages.map((message) => (
              <MessageBubble key={message.id} role={message.role}>
                {message.content}
              </MessageBubble>
            ))}
          </>
        )}
      </ChatContainer>
      <InputBar />
    </>
  );
}
