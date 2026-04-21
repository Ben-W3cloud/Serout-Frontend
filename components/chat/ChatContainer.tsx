import type { ReactNode } from "react";

type ChatContainerProps = {
  children: ReactNode;
};

export function ChatContainer({ children }: ChatContainerProps) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-10">
      {children}
      <div className="h-10" />
    </div>
  );
}
