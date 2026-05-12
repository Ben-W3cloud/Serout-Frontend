import { useChat } from '@/components/chat/ChatContext';
import { RouteCardWrapper } from './RouteCardWrapper';
import { SimulationCard } from './SimulationCard';
import { TransactionStatus } from './TransactionStatus';
import WalletButton from '../WalletButton';
import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';

const STAGE_LABEL = {
  idle:             '',
  parsing:          'Thinking…',
  route_selection:  'Choose a route',
  simulating:       'Simulating…',
  awaiting_confirm: 'Review & confirm',
  executing:        'Sending…',
  confirming:       'Confirming…',
  done:             'Done',
  error:            'Error',
};

export default function ChatWindow() {
  const { messages, isParsing, isSimulating, isExecuting, sendMessage, selectRoute } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const stage = isParsing ? 'parsing' : isSimulating ? 'simulating' : isExecuting ? 'executing' : 'idle';
  const busy = isParsing || isSimulating || isExecuting;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim() || busy) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100vh',
      background:    '#080808',
      color:         '#fff',
      fontFamily:    '"Inter", "SF Pro", system-ui, sans-serif',
      maxWidth:      '680px',
      margin:        '0 auto',
    }}>
      {/* Header */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        padding:        '16px 20px',
        borderBottom:   '1px solid #1a1a1a',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>
            <span style={{ color: '#14F195' }}>Se</span>rout
          </div>
          {stage !== 'idle' && (
            <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
              {STAGE_LABEL[stage]}
            </div>
          )}
        </div>
        <WalletButton />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.length === 0 && (
          <div style={{ color: '#333', textAlign: 'center', marginTop: '80px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚡</div>
            <div style={{ fontSize: '16px', marginBottom: '6px', color: '#555' }}>What do you want to do?</div>
            <div style={{ fontSize: '13px', color: '#333' }}>
              &quot;Send 0.1 SOL to 7xKX…&quot;<br />
              &quot;Swap 5 USDC for SOL&quot;<br />
              &quot;Transfer $50 to John&apos;s GTBank account&quot;
            </div>
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              style={{
                alignSelf:    isUser ? 'flex-end' : 'flex-start',
                maxWidth:     '88%',
              }}
            >
              {!(m.routes || m.simulation || m.status) && (
                <div style={{
                  background:   isUser ? 'linear-gradient(135deg, #9945FF22, #14F19522)' : '#111',
                  border:       isUser ? '1px solid #9945FF44' : '1px solid #1e1e1e',
                  borderRadius: '12px',
                  padding:      '10px 14px',
                  fontSize:     '14px',
                  lineHeight:   '1.5',
                  color:        '#e0e0e0',
                  whiteSpace:   'pre-wrap',
                }}>
                  {/* Simple bold/italic rendering */}
                  {m.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                </div>
              )}

              {m.routes && (
                <div style={{ width: '360px', maxWidth: '100%' }}>
                  {m.routes.map(route => <RouteCardWrapper key={route.id} route={route} onSelect={() => selectRoute(route)} />)}
                </div>
              )}

              {m.simulation && (
                <div style={{ width: '360px', maxWidth: '100%' }}>
                  <SimulationCard simulation={m.simulation} />
                </div>
              )}

              {m.status && (
                <div style={{ width: '360px', maxWidth: '100%' }}>
                  <TransactionStatus data={m.status} />
                </div>
              )}
            </div>
          );
        })}

        {busy && (
          <div style={{ alignSelf: 'flex-start', color: '#555', fontSize: '13px' }}>
            <span style={{ animation: 'pulse 1s infinite' }}>●</span> {STAGE_LABEL[stage]}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={submit} style={{
        display:      'flex',
        gap:          '8px',
        padding:      '16px 20px',
        borderTop:    '1px solid #1a1a1a',
        background:   '#080808',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={busy ? STAGE_LABEL[stage] + '…' : 'Send, swap, or pay…'}
          disabled={busy}
          style={{
            flex:         1,
            background:   '#111',
            border:       '1px solid #222',
            borderRadius: '8px',
            padding:      '10px 14px',
            color:        '#fff',
            fontSize:     '14px',
            outline:      'none',
          }}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          style={{
            background:   busy ? '#222' : 'linear-gradient(135deg, #9945FF, #14F195)',
            border:       'none',
            borderRadius: '8px',
            color:        '#fff',
            padding:      '10px 18px',
            fontWeight:   600,
            cursor:       busy ? 'not-allowed' : 'pointer',
            fontSize:     '14px',
          }}
        >
          →
        </button>
      </form>
    </div>
  );
}