import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/components/ui/cn";

type RouteStep = {
  icon: string;
  label: string;
};

type RouteCardProps = {
  title: string;
  subtitle: string;
  tag: "Fastest" | "Cheapest" | "Best Value";
  tone: "primary" | "secondary" | "tertiary";
  path: RouteStep[];
  received: string;
  duration: string;
  onSelect: () => void;
};

const toneStyles = {
  primary: {
    border: "hover:border-primary/40",
    glow: "from-primary/10",
    pill: "border-primary/20 bg-primary/10 text-primary-container",
    icon: "text-primary",
    button:
      "group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-container group-hover:text-on-primary",
  },
  secondary: {
    border: "hover:border-secondary/40",
    glow: "from-secondary/10",
    pill: "border-secondary/20 bg-secondary/10 text-secondary",
    icon: "text-secondary",
    button:
      "group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-secondary group-hover:to-primary-container group-hover:text-background",
  },
  tertiary: {
    border: "hover:border-tertiary/40",
    glow: "from-tertiary/10",
    pill: "border-tertiary/20 bg-tertiary/10 text-tertiary",
    icon: "text-tertiary",
    button:
      "group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-tertiary group-hover:to-primary group-hover:text-on-primary",
  },
};

export function RouteCard({
  title,
  subtitle,
  tag,
  tone,
  path,
  received,
  duration,
  onSelect,
}: RouteCardProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-[1.5rem] border border-outline-variant/20 bg-surface-variant/40 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] backdrop-blur-[24px] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.28)]",
        styles.border,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-br to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100",
          styles.glow,
        )}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 font-headline text-xl font-bold tracking-tight text-on-surface">
            {title}
            {tag === "Best Value" ? (
              <div className="relative ml-1 flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </div>
            ) : null}
          </h3>
          <p className="mt-1 text-xs font-medium text-on-surface-variant">
            {subtitle}
          </p>
        </div>

        <span
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest",
            styles.pill,
          )}
        >
          {tag}
        </span>
      </div>

      <div className="relative z-10 flex items-center justify-between rounded-xl border border-outline-variant/10 bg-surface-container-highest/50 p-4 text-sm text-on-surface-variant">
        {path.map((step, index) => (
          <div key={`${step.label}-${index}`} className="contents">
            <div className="flex flex-col items-center gap-1">
              <MaterialIcon name={step.icon} className={cn("text-xl", styles.icon)} />
              <span className="text-xs font-semibold text-on-surface">
                {step.label}
              </span>
            </div>
            {index < path.length - 1 ? (
              <MaterialIcon
                name="arrow_forward_ios"
                className="text-sm text-outline-variant"
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-4 py-1">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant">Est. Received</span>
          <span className="font-headline text-lg font-bold text-on-surface">
            {received}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-l border-outline-variant/10 pl-4">
          <span className="text-xs text-on-surface-variant">Settlement Time</span>
          <span className={cn("font-headline text-lg font-bold", styles.icon)}>
            {duration}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "relative z-10 mt-auto w-full rounded-xl border border-outline-variant/30 bg-surface-container-low py-3.5 text-sm font-semibold text-on-surface shadow-sm transition-all duration-300",
          styles.button,
        )}
      >
        Select Route
      </button>
    </div>
  );
}
