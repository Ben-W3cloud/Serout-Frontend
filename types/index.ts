export type IntentType = 'DIRECT_TRANSFER' | 'SWAP' | 'BANK_PAYOUT' | 'GENERAL_CHAT';

export interface DirectTransferParams {
  amount: number;
  token: string;
  recipient: string;
}

export interface SwapParams {
  inputToken: string;
  outputToken: string;
  amount: number;
  slippageBps?: number;
}

export interface BankPayoutParams {
  amount: number;
  currency: string;
  accountNumber?: string;
  bankName?: string;
}

export type TransactionParams = DirectTransferParams | SwapParams | BankPayoutParams;

export interface RouteOption {
  id: 'direct' | 'swap' | 'bank';
  title: string;
  description: string;
  icon: string;
  estimatedAmount: string;
  estimatedFee: string;
  estimatedTime: string;
  params: TransactionParams;
  enabled: boolean;
}

export interface SimulationResult {
  success: boolean;
  route: 'direct' | 'swap' | 'bank';
  estimatedFee: number;
  estimatedAmount: number;
  priceImpact?: number;
  slippage?: number;
  logs?: string[];
  error?: string;
  raw?: unknown;
}

export interface ExecutionResult {
  success: boolean;
  signature?: string;
  error?: string;
  confirmation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  routes?: RouteOption[];
  simulation?: SimulationResult;
  execution?: ExecutionResult;
  pending?: boolean;
}
