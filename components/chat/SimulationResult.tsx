import  type { SimulationResult } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

export function SimulationResult({ simulation, onExecute, onCancel, disabled }: {
  simulation: SimulationResult; onExecute: () => void; onCancel: () => void; disabled: boolean;
}) {
  return (
    <div className="ml-11 mt-3 glass-panel p-4 border-l-4 border-l-neon-cyan">
      <div className="flex items-center gap-2 mb-3">
        {simulation.success ? <CheckCircle2 className="w-5 h-5 text-neon-green" /> : <XCircle className="w-5 h-5 text-red-500" />}
        <h3 className="font-medium text-white text-sm">Simulation {simulation.success ? 'Successful' : 'Failed'}</h3>
      </div>

      {simulation.success ? (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm"><span className="text-slate-400">Fee</span><span className="text-white">{simulation.estimatedFee.toFixed(6)} SOL</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-400">Output</span><span className="text-white">{simulation.estimatedAmount.toFixed(6)}</span></div>
          {simulation.priceImpact !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Price Impact</span>
              <span className={cn("font-medium", simulation.priceImpact > 1 ? "text-yellow-400" : "text-neon-green")}>{simulation.priceImpact.toFixed(2)}%</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-start gap-2 mb-4 p-3 bg-red-500/10 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{simulation.error || 'Unknown error'}</p>
        </div>
      )}

      {simulation.success && (
        <div className="flex gap-2">
          <button onClick={onExecute} disabled={disabled} className="flex-1 bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/30 text-neon-cyan rounded-lg py-2 text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {disabled && <Loader2 className="w-4 h-4 animate-spin" />}Execute
          </button>
          <button onClick={onCancel} disabled={disabled} className="px-4 glass-button text-slate-300 text-sm disabled:opacity-50">Cancel</button>
        </div>
      )}
    </div>
  );
}
