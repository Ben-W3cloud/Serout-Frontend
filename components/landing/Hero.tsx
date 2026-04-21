import Image from "next/image";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAT9NYBRVAr4wIiHftLbTO3T5hIvVWip1Hh8fC_2gkH2lqd7aRyhxJYT8R8f5TrP05H1gZbFjRjX3u3k64sP6DqjpMKNvGeMYm3D11FxPla5FQmNRsJRddKctKQcjyK7baNkQaYx3rkwO_qKtO8DHjotcOSvzew0Jlz8FuOpH8MJUspyGjq3ieS6IM8WI8lZInXbcSX74iRaZ9xArXShhgNp1Lbx8RepKjRmm_U_EqzcoPhic-fgaSMaLEhvmaPtyfeaeTwjEmnFFsa";

export function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-[716px] flex-col items-center justify-between gap-16 md:flex-row"
    >
      <div className="z-10 flex flex-1 flex-col items-start gap-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-container-high px-4 py-2 font-label text-sm text-primary">
          <MaterialIcon name="bolt" className="text-[16px]" />
          <span>Intelligent Routing Active</span>
        </div>

        <h1 className="bg-gradient-to-r from-on-surface to-primary-container bg-clip-text font-headline text-6xl font-bold leading-none tracking-tighter text-transparent md:text-8xl">
          Route Your
          <br />
          Money Smarter
        </h1>

        <p className="max-w-xl font-body text-xl text-on-surface-variant">
          Choose how your money moves. Simulate before you send. Experience the
          ultimate control over your cross-chain transfers with precision routing.
        </p>

        <div className="flex w-full flex-col items-center gap-6 sm:w-auto sm:flex-row">
          <PrimaryButton fullWidth className="sm:w-auto">
            Start Transfer
          </PrimaryButton>
          <PrimaryButton
            variant="glass"
            fullWidth
            className="sm:w-auto"
            icon={<MaterialIcon name="play_circle" />}
          >
            View Demo
          </PrimaryButton>
        </div>
      </div>

      <div className="relative h-[600px] w-full flex-1">
        <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] border border-outline-variant/10 bg-surface-container-low shadow-[0_20px_60px_-15px_rgba(0,240,255,0.1)]">
          <Image
            src={heroImage}
            alt="Abstract glowing digital network paths with neon blue nodes on a dark void background representing data flow"
            fill
            priority
            sizes="(min-width: 760px) 80vw, 100vw"
            className="object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
