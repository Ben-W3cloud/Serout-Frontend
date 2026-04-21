import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Preview } from "@/components/landing/Preview";
import { TopNav } from "@/components/landing/TopNav";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-background">
      <TopNav />
      <main className="mx-auto flex max-w-7xl flex-col gap-32 px-6 pb-24 pt-32 md:px-12">
        <Hero />
        <HowItWorks />
        <Features />
        <Preview />
        <CTA />
      </main>
    </div>
  );
}
