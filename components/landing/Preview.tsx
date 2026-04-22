import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type RouteOption = {
  title: string;
  protocol: string;
  eta: string;
  amount: string;
  fee: string;
  selected?: boolean;
};

const routeOptions: RouteOption[] = [
  {
    title: "Fastest Route",
    protocol: "Via Stargate",
    eta: "Est. ~2 mins",
    amount: "9,985.42 USDC",
    fee: "Fee: $14.58",
    selected: true,
  },
  {
    title: "Cheapest Route",
    protocol: "Via Hop Protocol",
    eta: "Est. ~15 mins",
    amount: "9,992.10 USDC",
    fee: "Fee: $7.90",
  },
];

export function Preview() {
  return (
    <section id="preview" className="flex items-center justify-center py-12">
      <div className="w-full max-w-4xl rounded-[1.5rem] border border-outline-variant/20 bg-surface-variant/40 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="flex h-[500px] flex-col overflow-hidden rounded-[1.25rem] border border-outline-variant/10 bg-surface-dim">
          <div className="flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <MaterialIcon name="smart_toy" className="text-sm text-primary" />
              </div>
              <span className="font-bold text-on-surface">Serout Assistant</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
              <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                Live Node
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-hidden p-6">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-t-[1.5rem] rounded-bl-[1.5rem] border border-outline-variant/10 bg-surface-container-high p-4 text-sm">
                Route 10,000 USDC from Arbitrum to Optimism. Prioritize speed.
              </div>
            </div>

            <div className="flex justify-start">
              <div className="w-full max-w-[90%] rounded-t-[1.5rem] rounded-br-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary">
                  <MaterialIcon name="check_circle" className="text-lg" />
                  <span>Simulation Complete</span>
                </div>

                <div className="space-y-3">
                  {routeOptions.map((option) => (
                    <div
                      key={option.title}
                      className={
                        option.selected
                          ? "relative flex cursor-pointer items-center justify-between overflow-hidden rounded-lg border border-primary/30 bg-surface-container-highest p-4 transition-colors hover:bg-surface-variant"
                          : "flex cursor-pointer items-center justify-between rounded-lg border border-outline-variant/10 bg-surface-container p-4 transition-colors hover:bg-surface-variant"
                      }
                    >
                      {option.selected ? (
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />
                      ) : null}

                      <div>
                        <div className="flex items-center gap-2 font-bold text-on-surface">
                          {option.title}
                          {option.selected ? (
                            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                              Selected
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-on-surface-variant">
                          <span>{option.protocol}</span>
                          <span aria-hidden="true">&middot;</span>
                          <span>{option.eta}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={
                            option.selected
                              ? "font-bold text-primary"
                              : "font-bold text-on-surface"
                          }
                        >
                          {option.amount}
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          {option.fee}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <PrimaryButton
                  fullWidth
                  rounded="lg"
                  size="sm"
                  className="mt-6 py-3 text-sm"
                >
                  Execute Trade
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
