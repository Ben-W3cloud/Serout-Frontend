import { GlassCard } from "@/components/ui/GlassCard";
import { IconCircle } from "@/components/ui/IconCircle";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Step = {
  title: string;
  description: string;
  icon: string;
  tone: "primary" | "secondary" | "tertiary";
  filled?: boolean;
  hoverShadow: string;
};

const steps: Step[] = [
  {
    title: "1. Choose Destination",
    description:
      "Select your target chain and asset. Our engine instantly analyzes available liquidity pools across the network.",
    icon: "map",
    tone: "secondary",
    hoverShadow: "group-hover:shadow-[0_0_20px_rgba(197,126,255,0.2)]",
  },
  {
    title: "2. Select Route",
    description:
      "Optimize for speed, lowest fees, or maximum security. Review transparent path breakdowns before committing.",
    icon: "route",
    tone: "primary",
    hoverShadow: "group-hover:shadow-[0_0_20px_rgba(143,245,255,0.2)]",
  },
  {
    title: "3. Simulate & Send",
    description:
      "Run a dry execution to guarantee outcomes. Send with confidence knowing exactly what you'll receive.",
    icon: "send",
    tone: "tertiary",
    filled: true,
    hoverShadow: "group-hover:shadow-[0_0_20px_rgba(101,175,255,0.2)]",
  },
];

export function HowItWorks() {
  return (
    <section id= "how-it-works" className="relative flex flex-col items-center gap-16">
      <div className="absolute top-1/2 left-0 -z-10 hidden h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent md:block" />

      <SectionHeading
        align="center"
        title="How It Works"
        description="Execute complex multi-chain routes with unprecedented simplicity."
      />

      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <GlassCard
            key={step.title}
            className="group flex flex-col gap-6 border-none bg-surface-container-low p-8 transition-colors duration-500 hover:bg-surface-container"
          >
            <IconCircle tone={step.tone} className={step.hoverShadow}>
              <MaterialIcon
                name={step.icon}
                filled={step.filled}
                className="text-3xl"
              />
            </IconCircle>

            <div>
              <h3 className="mb-2 font-headline text-2xl font-bold text-on-surface">
                {step.title}
              </h3>
              <p className="font-body leading-relaxed text-on-surface-variant">
                {step.description}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
