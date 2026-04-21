import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,240,255,0.05)_0%,transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:url('data:image/svg+xml;utf8,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22_opacity=%220.02%22/%3E%3C/svg%3E')]" />

      <header className="fixed top-0 z-50 flex h-20 w-full items-center justify-center px-8">
        <div className="font-headline text-2xl font-black tracking-tighter text-primary drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
          Serout
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
