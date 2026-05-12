import { describe, it, expect, vi } from 'vitest';
import { parseIntent } from './client';

vi.mock('groq-sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                intent: 'DIRECT_TRANSFER',
                params: { amount: 0.1, token: 'SOL', recipient: '11111111111111111111111111111111' },
                message: 'Sending 0.1 SOL',
                confidence: 0.95,
              })
            }
          }]
        })
      }
    }
  }))
}));

describe('parseIntent', () => {
  it('parses transfer intent via Groq', async () => {
    const result = await parseIntent('send 0.1 SOL to 11111111111111111111111111111111');
    expect(result.intent).toBe('DIRECT_TRANSFER');
    expect(result.confidence).toBe(0.95);
  });

  it('handles empty input gracefully', async () => {
    const result = await parseIntent('');
    expect(result.intent).toBe('GENERAL_CHAT');
  });

  it('falls back to keyword matching on API failure', async () => {
    const result = await parseIntent('swap SOL for USDC');
    expect(result.intent).toBe('SWAP');
  });
});