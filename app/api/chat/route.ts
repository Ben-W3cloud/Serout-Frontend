import { NextRequest, NextResponse } from 'next/server';
import { parseIntent } from '@/lib/groq/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    const result = await parseIntent(message);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { intent: 'GENERAL_CHAT', message: 'Service temporarily unavailable.', confidence: 0 },
      { status: 500 }
    );
  }
}
