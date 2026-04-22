import { PrimaryButton } from "@/components/ui/PrimaryButton";
import Link  from "next/link"

export function CTA() {
  return (
    <section
      id="cta"
      className="relative flex flex-col items-center gap-8 py-24 text-center"
    >
      <div className="absolute inset-0 -z-10 mx-auto h-1/2 w-1/2 rounded-full bg-primary/5 blur-[100px]" />
      <h2 className="font-headline text-5xl font-bold tracking-tight md:text-6xl">
        Ready to take control?
      </h2>
      <p className="max-w-2xl text-xl text-on-surface-variant">
        Stop guessing with your cross-chain transactions. Start routing smarter
        today.
      </p>

      <Link href="/signup">
      <PrimaryButton size="xl" className="mt-4">
        Launch App
      </PrimaryButton>
      </Link>
    </section>
  );
}
