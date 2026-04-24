// import { MaterialIcon } from "@/components/ui/MaterialIcon";

// type SimulationCardProps = {
//   title: string;
//   amountSent: string;
//   sentAsset: string;
//   amountReceived: string;
//   receivedAsset: string;
//   receivedUsd: string;
//   feeLabel: string;
//   feeValue: string;
//   timeLabel: string;
//   timeValue: string;
// };

// export function SimulationCard({
//   title,
//   amountSent,
//   sentAsset,
//   amountReceived,
//   receivedAsset,
//   receivedUsd,
//   feeLabel,
//   feeValue,
//   timeLabel,
//   timeValue,
// }: SimulationCardProps) {
//   return (
//     <div className="group relative">
//       <div className="pointer-events-none absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-primary/30 to-secondary/30 opacity-50 blur-xl transition duration-500 group-hover:opacity-75" />

//       <div className="relative overflow-hidden rounded-[1.5rem] border border-outline-variant/15 bg-surface-variant/40 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-[24px]">
//         <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

//         <div className="relative z-10 mb-8 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
//               <MaterialIcon
//                 name="data_exploration"
//                 className="text-lg text-primary"
//               />
//             </div>
//             <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface">
//               {title}
//             </h2>
//           </div>

//           <div className="flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest/50 px-3 py-1">
//             <div className="relative flex h-2 w-2">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
//               <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(101,175,255,0.8)]" />
//             </div>
//             <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary">
//               Live
//             </span>
//           </div>
//         </div>

//         <div className="relative z-10 space-y-6">
//           <div className="flex flex-col">
//             <span className="mb-1 text-sm font-medium text-on-surface-variant">
//               You Send
//             </span>
//             <div className="flex items-baseline gap-2">
//               <span className="font-headline text-4xl font-light tracking-tighter text-on-surface lg:text-5xl">
//                 {amountSent}
//               </span>
//               <span className="font-headline text-xl font-bold text-primary">
//                 {sentAsset}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center py-2 pl-4 opacity-60">
//             <div className="mr-4 h-8 w-px bg-gradient-to-b from-outline-variant to-transparent" />
//             <MaterialIcon name="arrow_downward" className="text-primary" />
//           </div>

//           <div className="flex flex-col">
//             <span className="mb-1 text-sm font-medium text-on-surface-variant">
//               You Receive
//             </span>
//             <div className="flex items-baseline gap-2">
//               <span className="font-headline text-4xl font-bold tracking-tighter text-on-surface drop-shadow-[0_0_15px_rgba(248,249,254,0.1)] lg:text-5xl">
//                 {amountReceived}
//               </span>
//               <span className="font-headline text-xl font-bold text-[#F7931A]">
//                 {receivedAsset}
//               </span>
//             </div>
//             <span className="mt-1 text-xs text-on-surface-variant">
//               {receivedUsd}
//             </span>
//           </div>
//         </div>

//         <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 border-t border-outline-variant/15 pt-6">
//           <div className="rounded-lg bg-surface-container-low/50 p-3">
//             <span className="mb-1 flex items-center gap-1 text-xs text-on-surface-variant">
//               <MaterialIcon name="local_gas_station" className="text-[14px]" />
//               {feeLabel}
//             </span>
//             <span className="text-sm font-medium text-on-surface">{feeValue}</span>
//           </div>
//           <div className="rounded-lg bg-surface-container-low/50 p-3">
//             <span className="mb-1 flex items-center gap-1 text-xs text-on-surface-variant">
//               <MaterialIcon name="schedule" className="text-[14px]" />
//               {timeLabel}
//             </span>
//             <span className="text-sm font-medium text-on-surface">{timeValue}</span>
//           </div>
//         </div>

//         <div className="relative z-10 mt-8">
//           <button
//             type="button"
//             className="group/button relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-container p-[1px] transition-all duration-300 hover:shadow-[0_0_25px_rgba(143,245,255,0.3)] active:scale-[0.98]"
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-0 blur-md transition-opacity duration-300 group-hover/button:opacity-100" />
//             <div className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-6 py-4 text-base font-bold text-on-primary">
//               <MaterialIcon name="check_circle" />
//               Confirm Transaction
//             </div>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// ============================================================
// FILE 1: components/chat/SimulationCard.tsx  (NEW FILE)
//
// PURPOSE: Displays the simulation result and a Confirm button.
// Shown in the chat after user selects a route and simulation runs.
// ============================================================

"use client"

import { useChat } from "@/components/chat/ChatContext"
import { MaterialIcon } from "@/components/ui/MaterialIcon"

type SimulationCardProps = {
  simulation: {
    outputAmount: number
    feeAmount: number
    estimatedTime: string
    priceImpact: string
    routePath: string
    inputAmount: number
    inputToken: string
    outputToken: string
  }
}

export function SimulationCard({ simulation }: SimulationCardProps) {
  // Get confirmTransaction from context — called when user clicks Confirm
  const { confirmTransaction, isExecuting } = useChat()

  return (
    <div className="w-full max-w-md rounded-2xl border border-outline-variant/20 bg-surface-container-low p-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">

      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <MaterialIcon name="receipt_long" className="text-primary text-xl" />
        <span className="font-headline text-base font-bold text-on-surface">
          Transaction Preview
        </span>
      </div>

      {/* Route path */}
      <div className="mb-4 rounded-xl bg-surface-container-highest/50 px-4 py-3 text-xs text-on-surface-variant">
        {simulation.routePath}
      </div>

      {/* Key numbers */}
      <div className="mb-4 grid grid-cols-2 gap-3">

        {/* You send */}
        <div className="flex flex-col gap-1 rounded-xl bg-surface-container-highest/30 p-3">
          <span className="text-xs text-on-surface-variant">You Send</span>
          <span className="font-headline text-lg font-bold text-on-surface">
            {simulation.inputAmount} {simulation.inputToken}
          </span>
        </div>

        {/* You receive */}
        <div className="flex flex-col gap-1 rounded-xl bg-surface-container-highest/30 p-3">
          <span className="text-xs text-on-surface-variant">You Receive</span>
          <span className="font-headline text-lg font-bold text-primary">
            {simulation.outputAmount.toFixed(4)} {simulation.outputToken}
          </span>
        </div>

        {/* Fee */}
        <div className="flex flex-col gap-1 rounded-xl bg-surface-container-highest/30 p-3">
          <span className="text-xs text-on-surface-variant">Fee</span>
          <span className="font-headline text-base font-bold text-on-surface">
            {simulation.feeAmount.toFixed(6)} {simulation.inputToken}
          </span>
        </div>

        {/* Time */}
        <div className="flex flex-col gap-1 rounded-xl bg-surface-container-highest/30 p-3">
          <span className="text-xs text-on-surface-variant">Est. Time</span>
          <span className="font-headline text-base font-bold text-on-surface">
            {simulation.estimatedTime}
          </span>
        </div>
      </div>

      {/* Price impact — warn user if high */}
      {Number(simulation.priceImpact) < -1 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
          <MaterialIcon name="warning" className="text-sm" />
          High price impact: {simulation.priceImpact}%
        </div>
      )}

      {/* Confirm button — calls confirmTransaction from context */}
      <button
        type="button"
        onClick={confirmTransaction}
        disabled={isExecuting}
        className="w-full rounded-xl border border-primary/50 bg-gradient-to-r from-primary to-primary-container py-3.5 text-sm font-bold text-on-primary transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Show loading state while executing */}
        {isExecuting ? "Executing..." : "Confirm & Execute"}
      </button>

      {/* Disclaimer */}
      <p className="mt-3 text-center text-[11px] text-on-surface-variant/50">
        Transactions are irreversible. Verify all details before confirming.
      </p>
    </div>
  )
}


// ============================================================
// FILE 2: app/(app)/chat/page.tsx  (UPDATED)
//
// WHAT CHANGED:
// - Import SimulationCard and RouteCardWrapper
// - Pass selectRoute to RouteCardWrapper's onSelect
// - Render SimulationCard when message.simulation exists
// ============================================================
