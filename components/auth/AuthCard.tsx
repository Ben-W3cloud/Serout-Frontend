import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-outline-variant/15 bg-[rgba(34,38,43,0.4)] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-[24px] sm:p-10">
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-[50px]" />

      <div className="relative z-10 mb-8 text-center">
        <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight text-on-surface">
          {title}
        </h1>
        <p className="font-body text-sm text-on-surface-variant">{description}</p>
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
