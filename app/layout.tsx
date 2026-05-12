import type { Metadata } from 'next';
import './globals.css';
import dynamic from "next/dynamic";

const Providers = dynamic(
  () => import("@/components/providers").then((m) => m.Providers),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Serout - Solana AI Agent',
  description: 'Execute Solana transactions through natural language',
  icons: {
    icon: '/icon.png', // Points to public/icon.png
}
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
