import type { ReactNode } from "react";
import { AppShell } from "@/components/app/AppShell";
import { ChatProvider } from "@/components/chat/ChatContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <AppShell>{children}</AppShell>
    </ChatProvider>
  );
}
