import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type MessageBubbleProps = {
  role: "user" | "agent";
  children: ReactNode;
  label?: string;
  className?: string;
  contentClassName?: string;
};

export function MessageBubble({
  role,
  children,
  label,
  className,
  contentClassName,
}: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className={cn("flex w-full justify-end", className)}>
        <div
          className={cn(
            "max-w-[85%] rounded-2xl rounded-tr-sm border border-outline-variant/10 bg-surface-container-highest px-6 py-4 text-on-surface shadow-[0_8px_24px_rgba(0,0,0,0.3)] sm:max-w-md",
            contentClassName,
          )}
        >
          <p className="text-[15px] leading-relaxed">{children}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full justify-start gap-4 sm:gap-6", className)}>
      <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-variant shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
        <MaterialIcon
          name="smart_toy"
          className="text-[20px] text-primary"
          filled
        />
      </div>

      <div className="flex w-full flex-col gap-3">
        {label ? (
          <div className="ml-1 flex items-center gap-3">
            <span className="font-headline text-sm font-medium tracking-wide text-on-surface-variant">
              {label}
            </span>
          </div>
        ) : null}
        <div
          className={cn(
            "max-w-2xl rounded-2xl rounded-tl-sm border border-outline-variant/10 bg-surface-container-low px-6 py-4 text-on-surface shadow-[0_4px_20px_rgba(0,0,0,0.2)]",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
