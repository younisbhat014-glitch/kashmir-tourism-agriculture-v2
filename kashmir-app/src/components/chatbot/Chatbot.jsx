import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { API } from '../../utils/api';

const fetchChatAnswer = async (message, history) => {
  const response = await fetch(`${API}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history.slice(-8),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Chatbot failed');
  }

  if (Array.isArray(data.answers) && data.answers.length) {
    return data.answers.filter(Boolean);
  }

  return [data.answer || 'Aadab! Main yahan hoon. Aap apna sawal thoda aur detail me pooch sakte ho?'];
};

const QUICK_REPLIES = ['Best places?', 'Saffron price?', 'Gulmarg weather?', 'Taxi rent'];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Aadab! Welcome to Kashmir Portal. I'm your virtual guide. Ask me any question about tourism, hotels, food, vehicles, weather, crops, or farming.",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || typing) return;

    setInput('');
    const nextMessages = [...messages, { from: 'user', text: msg }];
    setMessages(nextMessages);
    setTyping(true);

    try {
      const answers = await fetchChatAnswer(msg, messages);
      setMessages((prev) => [
        ...prev,
        ...answers.map((answer) => ({ from: 'bot', text: answer })),
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: 'Connection issue aa gaya. Backend chatbot se answer nahi mila. Thoda baad dobara try karo.',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={22} strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Kashmir Guide</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                Online Now
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', width: 34, height: 34, display: 'grid', placeItems: 'center' }}>
              <X size={20} strokeWidth={2.4} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                {m.from === 'bot' && <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: 3 }}>Kashmir Guide</div>}
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="chat-msg bot" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 7, height: 7, background: '#aaa', borderRadius: '50%', animation: `pulse 1s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-quick-replies" style={{ padding: '8px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid #f0f0f0' }}>
            {QUICK_REPLIES.map((q) => (
              <button key={q} onClick={() => send(q)} style={{
                fontSize: '0.75rem',
                padding: '5px 10px',
                border: '1px solid var(--kashmir-teal)',
                borderRadius: 50,
                background: 'white',
                color: 'var(--kashmir-teal)',
                cursor: 'pointer',
                fontFamily: 'Nunito',
                fontWeight: 600,
              }}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="chatbot-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask anything..."
            />
            <button className="chatbot-send" onClick={() => send()} aria-label="Send message">
              <Send size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`chatbot-bubble ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(!open)}
        title="Chat with Kashmir Guide"
        aria-label={open ? 'Close Kashmir Guide chat' : 'Open Kashmir Guide chat'}
        aria-expanded={open}
      >
        {open ? (
          <X className="chatbot-close-mark" size={26} strokeWidth={2.6} />
        ) : (
          <span className="chatbot-robot-mark" aria-hidden="true">
            <span className="chatbot-robot-antenna" />
            <span className="chatbot-robot-face">
              <span className="chatbot-robot-eye left" />
              <span className="chatbot-robot-eye right" />
              <span className="chatbot-robot-mouth" />
            </span>
            <span className="chatbot-robot-signal one" />
            <span className="chatbot-robot-signal two" />
          </span>
        )}
      </button>
    </div>
  );
}
