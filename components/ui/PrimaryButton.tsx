import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/components/ui/cn";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  size?: "sm" | "lg" | "xl";
  variant?: "gradient" | "glass";
  rounded?: "full" | "xl" | "lg";
  fullWidth?: boolean;
};

const sizeClasses = {
  sm: "px-6 py-2.5 text-sm",
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl",
};

const roundedClasses = {
  full: "rounded-full",
  lg: "rounded-lg",
  xl: "rounded-[1.5rem]",
};

const variantClasses = {
  gradient:
    "bg-gradient-to-r from-primary to-primary-container text-on-primary hover:shadow-[0_0_20px_rgba(143,245,255,0.4)]",
  glass:
    "border border-outline-variant/20 bg-surface-variant/20 text-on-surface backdrop-blur-md hover:bg-surface-variant/40",
};

export function PrimaryButton({
  children,
  className,
  icon,
  size = "lg",
  variant = "gradient",
  rounded = "xl",
  fullWidth = false,
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 active:scale-95",
        sizeClasses[size],
        roundedClasses[rounded],
        variantClasses[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
