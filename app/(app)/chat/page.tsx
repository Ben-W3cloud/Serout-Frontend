
"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { InputBar } from "@/components/chat/InputBar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { RouteCardWrapper } from "@/components/chat/RouteCardWrapper";
import { SimulationCard } from "@/components/chat/SimulationCard";
import { useChat } from "@/components/chat/ChatContext";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useEffect, useRef } from "react";

export default function ChatPage() {
  // Pull selectRoute from context — passed to RouteCardWrapper
  const { messages, selectRoute } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <ChatContainer>
        {messages.length === 0 ? (
          // Empty state — shown before any messages
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

                {/* LOADING STATE — show pulse animation while waiting */}
                {message.isLoading ? (
                  <span className="animate-pulse text-sm text-on-surface-variant">
                    {message.content}
                  </span>

                // SIMULATION RESULT — show SimulationCard with confirm button
                ) : message.simulation ? (
                  <div className="flex flex-col gap-3 w-full">
                    <p className="text-sm text-on-surface-variant">{message.content}</p>
                    <SimulationCard simulation={message.simulation} />
                  </div>

                // ROUTES — show RouteCards for user to select from
                ) : message.routes && message.routes.length > 0 ? (
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-sm text-on-surface-variant">{message.content}</p>
                    {message.routes.map((route) => (
                      <RouteCardWrapper
                        key={route.id}
                        route={route}
                        // selectRoute triggers simulation after selection
                        onSelect={selectRoute}
                      />
                    ))}
                  </div>

                // CONFIRMED — show success with explorer link
                ) : message.confirmed ? (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <MaterialIcon name="check_circle" className="text-xl" filled />
                    {message.content}
                  </div>

                // DEFAULT — plain text message
                ) : (
                  message.content
                )}

              </MessageBubble>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </ChatContainer>
      <InputBar />
    </>
  );
}