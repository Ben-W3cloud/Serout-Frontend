"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/components/ui/cn";
import { useWallet } from "@solana/wallet-adapter-react";

type WalletId = "phantom" | "solflare";

type WalletOption = {
  id: WalletId;
  label: string;
  description: string;
  accentClassName: string;
  icon: string;
};

type WalletConnectModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  onSelectWallet?: (walletId: WalletId) => void;
  showSolflare?: boolean;
};

const walletOptions: WalletOption[] = [
  {
    id: "phantom",
    label: "Phantom",
    description: "Connect with your Phantom wallet",
    accentClassName:
      "from-primary/20 via-primary/10 to-transparent border-primary/20 text-primary",
    icon: "wallet",
  },
  {
    id: "solflare",
    label: "Solflare",
    description: "Connect with your Solflare wallet",
    accentClassName:
      "from-secondary/20 via-secondary/10 to-transparent border-secondary/20 text-secondary",
    icon: "flare",
  },
];

export function WalletConnectModal({
  isOpen,
  onClose,
  onSelectWallet,
  showSolflare = true,
}: WalletConnectModalProps) {

  const { select } = useWallet()  // only select, nothing else
    
  const handleConnect = async (option : any) => {
   const walletName = option.id === "phantom" ? "Phantom" : "Solflare"
   select(walletName as any)
   onClose?.()
  }

  const options = showSolflare
    ? walletOptions
    : walletOptions.filter((option) => option.id !== "solflare");

  return (
    <div
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-200",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        type="button"
        aria-label="Close wallet modal"
        className={cn(
          "absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-connect-title"
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-outline-variant/20 bg-surface-variant/40 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-[28px] transition-all duration-200",
          isOpen ? "scale-100 opacity-100" : "scale-[0.96] opacity-0",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/12 blur-[60px]" />
          <div className="absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-secondary/10 blur-[70px]" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
        </div>

        <div className="relative z-10 p-6 sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_20px_rgba(143,245,255,0.12)]">
                <MaterialIcon
                  name="account_balance_wallet"
                  className="text-[22px] text-primary"
                  filled
                />
              </div>
              <div>
                <h2
                  id="wallet-connect-title"
                  className="font-headline text-2xl font-bold tracking-tight text-on-surface"
                >
                  Connect Wallet
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Choose a wallet to continue inside Serout.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-high/70 text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
              onClick={onClose}
            >
              <MaterialIcon name="close" className="text-xl" />
            </button>
          </div>

          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="group relative block w-full overflow-hidden rounded-[1.25rem] border border-outline-variant/20 bg-surface-container-low/80 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-container hover:shadow-[0_16px_30px_rgba(0,0,0,0.28)]"
                onClick={() => handleConnect(option)}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    option.accentClassName,
                  )}
                />

                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border bg-background/40 shadow-[0_0_18px_rgba(0,0,0,0.18)]",
                      option.accentClassName,
                    )}
                  >
                    <MaterialIcon name={option.icon} className="text-[22px]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-headline text-lg font-semibold tracking-tight text-on-surface">
                      {option.label}
                    </div>
                    <div className="mt-1 text-sm text-on-surface-variant">
                      {option.description}
                    </div>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-high/80 text-on-surface-variant transition-colors group-hover:border-primary/30 group-hover:text-primary">
                    <MaterialIcon name="arrow_forward" className="text-lg" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
