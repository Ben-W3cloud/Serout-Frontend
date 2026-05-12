import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const SYSTEM_PROMPT = `You are Serout, an expert Solana blockchain AI agent. Parse user messages and extract transaction intents.

Analyze and classify as:
1. DIRECT_TRANSFER - Send SOL/tokens to an address
2. SWAP - Exchange one token for another
3. BANK_PAYOUT - Withdraw/off-ramp to bank
4. GENERAL_CHAT - No transaction intent

Respond ONLY with JSON:
{
  "intent": "DIRECT_TRANSFER" | "SWAP" | "BANK_PAYOUT" | "GENERAL_CHAT",
  "params": {
    "amount": number,
    "token": string,
    "recipient": string,
    "inputToken": string,
    "outputToken": string,
    "currency": string,
    "accountNumber": string
  },
  "message": "Friendly response explaining what was understood. Ask for missing info.",
  "confidence": 0.0 to 1.0
}

Rules:
- Default token is SOL
- For swaps, default input is SOL if only output mentioned
- Use GENERAL_CHAT if intent is unclear
- Be concise but helpful
- Never use markdown in JSON`;

export async function parseIntent(message: string) {
  if (!message.trim()) {
    return {
      intent: 'GENERAL_CHAT',
      message: 'How can I help? Try: "send 0.1 SOL to ADDRESS", "swap SOL to USDC", or "bank payout $100".',
      confidence: 1,
    };
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      model: 'llama3-70b-8192',
      temperature: 0.1,
      max_tokens: 512,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from Groq');

    const parsed = JSON.parse(content);
    return {
      intent: parsed.intent || 'GENERAL_CHAT',
      params: parsed.params || {},
      message: parsed.message || 'How can I help?',
      confidence: parsed.confidence || 0.5,
    };
  } catch (error) {
    console.error('Groq error:', error);
    // Keyword fallback
    const lower = message.toLowerCase();
    if (lower.includes('send') || lower.includes('transfer')) {
      return { intent: 'DIRECT_TRANSFER', message: 'Transfer detected. Please specify amount and recipient.', confidence: 0.6 };
    }
    if (lower.includes('swap') || lower.includes('exchange')) {
      return { intent: 'SWAP', message: 'Swap detected. Please specify tokens and amount.', confidence: 0.6 };
    }
    if (lower.includes('bank') || lower.includes('withdraw')) {
      return { intent: 'BANK_PAYOUT', message: 'Bank payout detected. Please specify amount.', confidence: 0.6 };
    }
    return { intent: 'GENERAL_CHAT', message: "I'm not sure what you'd like. Try 'send', 'swap', or 'bank payout'.", confidence: 0.3 };
  }
}