import { MaterialIcon } from "@/components/ui/MaterialIcon";

type SimulationCardProps = {
  title: string;
  amountSent: string;
  sentAsset: string;
  amountReceived: string;
  receivedAsset: string;
  receivedUsd: string;
  feeLabel: string;
  feeValue: string;
  timeLabel: string;
  timeValue: string;
};

export function SimulationCard({
  title,
  amountSent,
  sentAsset,
  amountReceived,
  receivedAsset,
  receivedUsd,
  feeLabel,
  feeValue,
  timeLabel,
  timeValue,
}: SimulationCardProps) {
  return (
    <div className="group relative">
      <div className="pointer-events-none absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-primary/30 to-secondary/30 opacity-50 blur-xl transition duration-500 group-hover:opacity-75" />

      <div className="relative overflow-hidden rounded-[1.5rem] border border-outline-variant/15 bg-surface-variant/40 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-[24px]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

        <div className="relative z-10 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <MaterialIcon
                name="data_exploration"
                className="text-lg text-primary"
              />
            </div>
            <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest/50 px-3 py-1">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(101,175,255,0.8)]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary">
              Live
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-on-surface-variant">
              You Send
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-4xl font-light tracking-tighter text-on-surface lg:text-5xl">
                {amountSent}
              </span>
              <span className="font-headline text-xl font-bold text-primary">
                {sentAsset}
              </span>
            </div>
          </div>

          <div className="flex items-center py-2 pl-4 opacity-60">
            <div className="mr-4 h-8 w-px bg-gradient-to-b from-outline-variant to-transparent" />
            <MaterialIcon name="arrow_downward" className="text-primary" />
          </div>

          <div className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-on-surface-variant">
              You Receive
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-4xl font-bold tracking-tighter text-on-surface drop-shadow-[0_0_15px_rgba(248,249,254,0.1)] lg:text-5xl">
                {amountReceived}
              </span>
              <span className="font-headline text-xl font-bold text-[#F7931A]">
                {receivedAsset}
              </span>
            </div>
            <span className="mt-1 text-xs text-on-surface-variant">
              {receivedUsd}
            </span>
          </div>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 border-t border-outline-variant/15 pt-6">
          <div className="rounded-lg bg-surface-container-low/50 p-3">
            <span className="mb-1 flex items-center gap-1 text-xs text-on-surface-variant">
              <MaterialIcon name="local_gas_station" className="text-[14px]" />
              {feeLabel}
            </span>
            <span className="text-sm font-medium text-on-surface">{feeValue}</span>
          </div>
          <div className="rounded-lg bg-surface-container-low/50 p-3">
            <span className="mb-1 flex items-center gap-1 text-xs text-on-surface-variant">
              <MaterialIcon name="schedule" className="text-[14px]" />
              {timeLabel}
            </span>
            <span className="text-sm font-medium text-on-surface">{timeValue}</span>
          </div>
        </div>

        <div className="relative z-10 mt-8">
          <button
            type="button"
            className="group/button relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-container p-[1px] transition-all duration-300 hover:shadow-[0_0_25px_rgba(143,245,255,0.3)] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-0 blur-md transition-opacity duration-300 group-hover/button:opacity-100" />
            <div className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-6 py-4 text-base font-bold text-on-primary">
              <MaterialIcon name="check_circle" />
              Confirm Transaction
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
