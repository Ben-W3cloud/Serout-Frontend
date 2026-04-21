import { cn } from "@/components/ui/cn";

type SectionHeadingProps = {
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl",
        className,
      )}
    >
      <h2 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
        {title}
      </h2>
      <p className="text-lg text-on-surface-variant">{description}</p>
    </div>
  );
}
