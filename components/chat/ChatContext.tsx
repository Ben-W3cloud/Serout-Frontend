"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ChatMessage = {
  id: string;
  role: "user";
  content: string;
};

type ChatContextValue = {
  draft: string;
  messages: ChatMessage[];
  resetChat: () => void;
  sendMessage: () => void;
  setDraft: (value: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const resetChat = useCallback(() => {
    setDraft("");
    setMessages([]);
  }, []);

  const sendMessage = useCallback(() => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `${Date.now()}`,
        role: "user",
        content: trimmedDraft,
      },
    ]);
    setDraft("");
  }, [draft]);

  const value = useMemo(
    () => ({
      draft,
      messages,
      resetChat,
      sendMessage,
      setDraft,
    }),
    [draft, messages, resetChat, sendMessage],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
}
