import { generateId } from '../utils';

export interface BankPayoutSimulation {
  success: boolean;
  estimatedFee: number;
  estimatedAmount: number;
  processingTime: string;
  referenceId: string;
  exchangeRate: number;
  error?: string;
}

export interface BankPayoutResult {
  success: boolean;
  referenceId: string;
  signature: string;
  status: 'pending' | 'completed' | 'failed';
  estimatedCompletion: string;
  error?: string;
}

export async function simulateBankPayout(
  amount: number,
  currency: string = 'USD'
): Promise<BankPayoutSimulation> {
  await new Promise(resolve => setTimeout(resolve, 600));
  const exchangeRate = currency === 'USD' ? 145.5 : 1;
  return {
    success: true,
    estimatedFee: 0.001,
    estimatedAmount: amount * exchangeRate,
    processingTime: '1-3 business days',
    referenceId: `BANK-${generateId().toUpperCase()}`,
    exchangeRate,
  };
}

export async function executeMockBankPayout(
  amount: number,
  currency: string = 'USD'
): Promise<BankPayoutResult> {
  await new Promise(resolve => setTimeout(resolve, 1200));
  const referenceId = `BANK-${generateId().toUpperCase()}`;
  return {
    success: true,
    referenceId,
    signature: `mock_sig_${generateId()}`,
    status: 'pending',
    estimatedCompletion: new Date(Date.now() + 86400000).toISOString(),
  };
}
