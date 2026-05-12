import { RouteOption } from '@/types';
import { cn } from '@/lib/utils';
import { Send, ArrowLeftRight, Building2, ChevronRight } from 'lucide-react';

const icons = { send: Send, swap: ArrowLeftRight, bank: Building2 };

export function RouteSelector({ routes, onSelect, disabled }: { routes: RouteOption[]; onSelect: (r: RouteOption) => void; disabled: boolean }) {
  return (
    <div className="ml-11 mt-3 grid gap-3">
      <p className="text-xs text-slate-400 mb-1">Select execution route:</p>
      {routes.map((route) => {
        const Icon = icons[route.icon as keyof typeof icons];
        return (
          <button
            key={route.id}
            onClick={() => onSelect(route)}
            disabled={disabled || !route.enabled}
            className={cn("glass-button p-4 text-left w-full group transition-all hover:border-neon-cyan/30 hover:bg-glass-300", disabled && "opacity-50 cursor-not-allowed")}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">{route.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{route.description}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-neon-cyan transition-colors" />
            </div>
            <div className="mt-3 pt-3 border-t border-glass-border grid grid-cols-3 gap-2">
              <div><p className="text-[10px] text-slate-500 uppercase">Amount</p><p className="text-xs text-white font-medium">{route.estimatedAmount}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase">Fee</p><p className="text-xs text-neon-green font-medium">{route.estimatedFee}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase">Time</p><p className="text-xs text-slate-300">{route.estimatedTime}</p></div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
