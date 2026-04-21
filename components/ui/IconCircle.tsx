import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

type Tone = "primary" | "secondary" | "tertiary";

type IconCircleProps = {
  children: ReactNode;
  className?: string;
  tone?: Tone;
};

const toneClasses: Record<Tone, string> = {
  primary: "border border-primary/20 bg-primary/10 text-primary",
  secondary: "border border-secondary/20 bg-secondary-container/20 text-secondary",
  tertiary: "border border-tertiary/20 bg-tertiary-container/20 text-tertiary",
};

export function IconCircle({
  children,
  className,
  tone = "primary",
}: IconCircleProps) {
  return (
    <div
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-full transition-shadow",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
