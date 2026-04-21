import { ChatContainer } from "@/components/chat/ChatContainer";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { RouteCard } from "@/components/chat/RouteCard";
import { SimulationCard } from "@/components/chat/SimulationCard";

const routes = [
  {
    title: "Starlight Route",
    subtitle: "Direct liquidity tap",
    tag: "Best Value" as const,
    tone: "primary" as const,
    path: [
      { icon: "toll", label: "USDC" },
      { icon: "currency_exchange", label: "NGN" },
      { icon: "account_balance", label: "GTBank" },
    ],
    received: "NGN 15,420,500",
    duration: "~2 mins",
  },
  {
    title: "Nebula Express",
    subtitle: "High-speed rails",
    tag: "Fastest" as const,
    tone: "secondary" as const,
    path: [
      { icon: "dynamic_feed", label: "SOL" },
      { icon: "currency_exchange", label: "NGN" },
      { icon: "account_balance", label: "GTBank" },
    ],
    received: "NGN 15,381,250",
    duration: "~15 secs",
  },
  {
    title: "Vector Bridge",
    subtitle: "Balanced execution layer",
    tag: "Cheapest" as const,
    tone: "tertiary" as const,
    path: [
      { icon: "savings", label: "USDT" },
      { icon: "swap_horiz", label: "NGN" },
      { icon: "account_balance", label: "GTBank" },
    ],
    received: "NGN 15,398,910",
    duration: "~4 mins",
  },
];

export default function ChatPage() {
  return (
    <ChatContainer>
      <div className="flex justify-center">
        <span className="rounded-full bg-surface-container/50 px-3 py-1 text-xs font-medium text-on-surface-variant/50 backdrop-blur-sm">
          Today, 14:23 UTC
        </span>
      </div>
{/* 
      <MessageBubble role="user">
        Route 10,000 USDC from Arbitrum to a GTBank account. Prioritize the best
        outcome.
      </MessageBubble>

      <MessageBubble
        role="agent"
        label="Serout Protocol"
        className="max-w-4xl"
        contentClassName="max-w-none w-full bg-transparent p-0 shadow-none border-none"
      >
        <div className="pt-2 text-[15px] leading-relaxed text-on-surface-variant">
          I&apos;ve analyzed current cross-chain liquidity and localized off-ramps.
          Here are the most optimal routing protocols to deliver{" "}
          <span className="font-semibold text-on-surface">$10,000</span> to a{" "}
          <span className="font-semibold text-on-surface">GTBank</span> account.
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => (
            <RouteCard key={route.title} {...route} />
          ))}
        </div>
      </MessageBubble>

      <MessageBubble role="user">
        Simulate the best value route and show the expected settlement details.
      </MessageBubble>

      <MessageBubble
        role="agent"
        label="Serout Protocol"
        className="max-w-4xl"
        contentClassName="max-w-none w-full bg-transparent p-0 shadow-none border-none"
      >
        <div className="pt-2 text-[15px] leading-relaxed text-on-surface-variant">
          I&apos;ve calculated the optimal routing for your swap. Please review the
          simulation details below before confirming the transaction.
        </div>

        <div className="mt-5 max-w-xl">
          <SimulationCard
            title="Simulation Result"
            amountSent="10,000"
            sentAsset="USDC"
            amountReceived="0.1542"
            receivedAsset="BTC"
            receivedUsd="~$9,985.40 USD at current rate"
            feeLabel="Network Fee"
            feeValue="~$4.50 (Gas)"
            timeLabel="Estimated Time"
            timeValue="< 30 Seconds"
          />
        </div>
      </MessageBubble> */}
    </ChatContainer>
  );
}
