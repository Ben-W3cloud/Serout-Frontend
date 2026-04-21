import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-outline-variant/10 bg-surface-container-low",
        className,
      )}
    >
      {children}
    </div>
  );
}
