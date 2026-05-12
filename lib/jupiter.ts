import {
  fromSmallestUnit,
  SOLANA_TOKEN_MINTS,
  TOKEN_DECIMALS,
  toSmallestUnit,
} from "@/constants/token";
import type { SeroutRoute, TokenSymbol } from "@/types/routes";

const JUPITER_SWAP_V2_API = "https://api.jup.ag/swap/v2";

type JupiterOrderParams = {
  inputToken: TokenSymbol;
  outputToken: TokenSymbol;
  amount: number;
  slippageBps?: number;
  taker?: string;
};

export type JupiterOrder = {
  requestId?: string;
  transaction?: string;
  outAmount?: string;
  outputAmount?: string;
  priceImpactPct?: string;
  routePlan?: Array<{ swapInfo?: { label?: string } }>;
  router?: string;
  mode?: string;
  lastValidBlockHeight?: number;
  signatureFeeLamports?: number;
  prioritizationFeeLamports?: number;
  error?: string;
};

export type JupiterExecuteResult = {
  status?: "Success" | "Failed";
  signature?: string;
  error?: string;
  code?: number;
  slot?: string;
};

export async function getJupiterOrder({
  inputToken,
  outputToken,
  amount,
  slippageBps = 50,
  taker,
}: JupiterOrderParams): Promise<JupiterOrder> {
  const apiKey = process.env.JUPITER_API_KEY;
  if (!apiKey) {
    throw new Error("JUPITER_API_KEY is not configured.");
  }

  const inputMint = SOLANA_TOKEN_MINTS[inputToken];
  const outputMint = SOLANA_TOKEN_MINTS[outputToken];
  const rawAmount = toSmallestUnit(amount, inputToken);

  if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
    throw new Error("Swap amount must be greater than zero.");
  }

  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: String(rawAmount),
    slippageBps: String(slippageBps),
  });

  if (taker) params.set("taker", taker);

  const response = await fetch(`${JUPITER_SWAP_V2_API}/order?${params}`, {
    headers: {
      Accept: "application/json",
      "x-api-key": apiKey,
    },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as JupiterOrder | null;

  if (!response.ok || !data) {
    throw new Error(
      `Jupiter order failed (${response.status}): ${data?.error || response.statusText}`,
    );
  }

  if (data.error) {
    throw new Error(`Jupiter order failed: ${data.error}`);
  }

  return data;
}

export async function executeJupiterSwap(
  signedTransaction: string,
  requestId: string,
): Promise<JupiterExecuteResult> {
  const apiKey = process.env.JUPITER_API_KEY;
  if (!apiKey) {
    throw new Error("JUPITER_API_KEY is not configured.");
  }

  const response = await fetch(`${JUPITER_SWAP_V2_API}/execute`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      signedTransaction,
      requestId,
    }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as JupiterExecuteResult | null;

  if (!response.ok || !data) {
    throw new Error(
      `Jupiter execute failed (${response.status}): ${data?.error || response.statusText}`,
    );
  }

  return data;
}

export async function generateSwapRoutes(
  inputToken: TokenSymbol,
  outputToken: TokenSymbol,
  amount: number,
): Promise<SeroutRoute[]> {
  const variants = [
    { id: "swap-fastest", tag: "Fastest" as const, slippageBps: 100, time: "~20s" },
    { id: "swap-cheapest", tag: "Cheapest" as const, slippageBps: 30, time: "~60s" },
    { id: "swap-best-value", tag: "Best Value" as const, slippageBps: 50, time: "~35s" },
  ];

  const orders = await Promise.all(
    variants.map((variant) =>
      getJupiterOrder({
        inputToken,
        outputToken,
        amount,
        slippageBps: variant.slippageBps,
      }),
    ),
  );

  return variants.map((variant, index) => {
    const order = orders[index];
    const outAmount = getOutputAmount(order, outputToken);
    const fee = estimateNetworkFee(order);

    return {
      id: variant.id,
      tag: variant.tag,
      transferType: "swap",
      inputAmount: amount,
      inputToken,
      outputToken,
      estimatedOutput: outAmount,
      estimatedFee: fee,
      estimatedTime: variant.time,
      slippageBps: variant.slippageBps,
      meta: {
        label: routeLabel(order),
        reliable: variant.tag !== "Fastest",
        provider: "Jupiter",
        network: "mainnet-beta",
      },
    };
  });
}

export function getOutputAmount(order: JupiterOrder, outputToken: TokenSymbol): number {
  const rawAmount = order.outAmount || order.outputAmount || "0";
  return fromSmallestUnit(rawAmount, outputToken);
}

export function getPriceImpact(order: JupiterOrder): number {
  const impact = Number(order.priceImpactPct ?? 0);
  return Number.isFinite(impact) ? impact * 100 : 0;
}

export function routeLabel(order: JupiterOrder): string {
  const labels =
    order.routePlan
      ?.map((route) => route.swapInfo?.label)
      .filter((label): label is string => Boolean(label)) ?? [];

  if (labels.length > 0) return labels.join(" to ");
  if (order.router) return `Jupiter ${order.router}`;
  if (order.mode) return `Jupiter ${order.mode}`;
  return "Jupiter Aggregated";
}

function estimateNetworkFee(order: JupiterOrder): number {
  const lamports =
    Number(order.signatureFeeLamports ?? 0) +
    Number(order.prioritizationFeeLamports ?? 0);

  if (!Number.isFinite(lamports) || lamports <= 0) {
    return 0.000025;
  }

  return lamports / 10 ** TOKEN_DECIMALS.SOL;
}
