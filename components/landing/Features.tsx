import { GlassCard } from "@/components/ui/GlassCard";
import { IconCircle } from "@/components/ui/IconCircle";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";

type FeatureCard = {
  title: string;
  description: string;
  icon: string;
  tone: "primary" | "secondary" | "tertiary";
  spanClass: string;
  iconClassName?: string;
  subtleIcon?: boolean;
};

const features: FeatureCard[] = [
  {
    title: "Intelligent Route Selection",
    description:
      "Our algorithm scores paths across 40+ chains simultaneously, finding the optimal bridge and DEX combinations in milliseconds.",
    icon: "call_split",
    tone: "primary",
    spanClass: "md:col-span-8",
  },
  {
    title: "Simulation Engine",
    description:
      "Dry-run transactions against current state. Zero surprises.",
    icon: "science",
    tone: "secondary",
    spanClass: "md:col-span-4",
    iconClassName: "text-6xl",
    subtleIcon: true,
  },
  {
    title: "Onchain Execution",
    description:
      "Fully decentralized settlement without centralized intermediaries.",
    icon: "link",
    tone: "tertiary",
    spanClass: "md:col-span-4",
    iconClassName: "text-6xl",
    subtleIcon: true,
  },
  {
    title: "Transparent Fees",
    description:
      "Every gas cost, bridge fee, and liquidity provider cut is broken down before you sign. What you see simulated is what you get.",
    icon: "receipt_long",
    tone: "secondary",
    spanClass: "md:col-span-8",
  },
];

export function Features() {
  return (
    <section id="features" className="flex flex-col gap-12">
      <SectionHeading
        title="Engineered for Precision"
        description="Advanced architecture delivering institutional-grade routing to everyone."
      />

      <div className="grid auto-rows-[minmax(240px,auto)] grid-cols-1 gap-6 md:grid-cols-12">
        {features.map((feature, index) => {
          const isLarge = feature.spanClass.includes("8");

          return (
            <GlassCard
              key={feature.title}
              className={`${feature.spanClass} group relative flex flex-col justify-between overflow-hidden bg-surface-container-low p-8`}
            >
              {index === 0 ? (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              ) : null}

              {feature.subtleIcon ? (
                <div className="absolute top-0 right-0 p-6 opacity-20">
                  <MaterialIcon
                    name={feature.icon}
                    className={`${feature.iconClassName ?? ""} ${
                      feature.tone === "secondary"
                        ? "text-secondary"
                        : "text-tertiary"
                    }`}
                  />
                </div>
              ) : (
                <div className="z-10">
                  <IconCircle
                    tone={feature.tone}
                    className="mb-6 h-12 w-12 border-none"
                  >
                    <MaterialIcon name={feature.icon} />
                  </IconCircle>
                </div>
              )}

              <div className="z-10 mt-auto max-w-lg">
                <h3
                  className={`mb-3 font-headline font-bold text-on-surface ${
                    isLarge ? "text-2xl" : "text-xl"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-on-surface-variant ${
                    isLarge ? "" : "text-sm"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
