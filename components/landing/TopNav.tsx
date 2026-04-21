"use client"

import { useState } from "react";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import Link from "next/link";

const navLinks = [
  { href: "#", label: "Home",active: true },
  { href: "#how-it-works", label: "How It Works",active: false },
  { href: "#features", label: "Features",active: false },
  { href: "#preview", label: "Preview",active: false },
  
];

export function TopNav() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <nav className="fixed top-0 z-50 w-full border-none bg-background/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-2xl">
      <div className="flex h-20 w-full items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <span className="font-headline text-2xl font-black tracking-tighter text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            Serout
          </span>
        </div>

        <div className="hidden items-center gap-8 font-headline font-bold tracking-tight md:flex">
          {navLinks.map((link) => {
            const isActive = activeTab === link.label;
            return (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActiveTab(link.label)}
              className={
                isActive
                  ? "border-b-2 border-[#00F0FF] pb-1 text-[#00F0FF] transition-all duration-300 hover:bg-white/5 hover:text-[#8ff5ff] active:scale-95"
                  : "text-slate-400 transition-all duration-300 hover:bg-white/5 hover:text-[#8ff5ff] active:scale-95"
              }
            >
              {link.label}
            </a>
        )})}
        </div>
        <Link href="/login">
          <PrimaryButton rounded="full" size="sm">
            Sign In
          </PrimaryButton>
        </Link>
      </div>
    </nav>
  );
}
