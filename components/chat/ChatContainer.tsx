import type { ReactNode } from "react";
import { InputBar } from "@/components/chat/InputBar";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type ChatContainerProps = {
  children: ReactNode;
};

const navItems = [
  { label: "New Chat", icon: "add_comment", active: true },
  { label: "History", icon: "history", active: false },
  { label: "Analytics", icon: "insert_chart", active: false },
  { label: "Settings", icon: "settings", active: false },
];

export function ChatContainer({ children }: ChatContainerProps) {
  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-on-background selection:bg-primary/30 selection:text-primary">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-20%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <aside className="fixed top-0 left-0 z-40 hidden h-screen w-72 flex-col border-r border-white/[0.02] bg-surface-container-low px-4 py-8 md:flex">
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-surface-variant shadow-[0_0_15px_rgba(0,238,252,0.2)]">
              <MaterialIcon
                name="hub"
                className="text-xl text-primary"
                filled
              />
            </div>
            <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-surface-container-low bg-primary" />
          </div>
          <div>
            <h1 className="font-headline text-lg font-bold tracking-tight text-on-surface">
              Serout AI
            </h1>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
              Neural Interface Active
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={
                item.active
                  ? "flex w-full items-center gap-3 rounded-lg border-l-4 border-[#00F0FF] bg-gradient-to-r from-[#00F0FF]/10 to-transparent px-4 py-3 text-left text-[#00F0FF]"
                  : `flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-500 transition-all duration-200 hover:translate-x-1 hover:bg-white/5 hover:text-slate-200 ${
                      index === navItems.length - 1 ? "mt-auto mb-4" : ""
                    }`
              }
            >
              <MaterialIcon
                name={item.icon}
                className="text-xl"
                filled={item.active}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

      </aside>

      <main className="relative z-10 ml-0 flex h-screen flex-1 flex-col md:ml-72">
        <header className="sticky top-0 z-50 flex h-16 items-center border-b border-outline-variant/10 bg-background/80 px-4 backdrop-blur-xl md:hidden">
          <button type="button" className="p-2 text-on-surface-variant">
            <MaterialIcon name="menu" />
          </button>
          <h1 className="ml-2 font-headline text-base font-bold text-on-surface">
            Serout AI
          </h1>
        </header>

        <header className="hidden h-20 items-center border-b border-outline-variant/10 bg-background/60 px-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-2xl md:flex">
          <div className="font-medium tracking-normal text-on-surface-variant">
            <span className="text-on-surface">Terminal</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-variant/40 transition-colors hover:bg-white/10"
            >
              <MaterialIcon
                name="notifications"
                className="text-xl text-on-surface-variant"
              />
            </button>
            <button
              type="button"
              className="rounded-xl border border-primary/50 bg-gradient-to-r from-primary to-primary-container px-5 py-2.5 text-sm font-bold text-on-primary transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95"
            >
              Connect Wallet
            </button>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-outline-variant/30 bg-surface-container-highest transition-colors hover:border-primary/50">
              <MaterialIcon name="person" className="text-lg text-on-surface" />
            </div>
          </div>
        </header>

        <div className="relative flex-1 overflow-y-auto px-4 py-8 pb-40 sm:px-6 lg:px-12">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
            {children}
            <div className="h-10" />
          </div>
        </div>

        <InputBar />
      </main>
    </div>
  );
}
