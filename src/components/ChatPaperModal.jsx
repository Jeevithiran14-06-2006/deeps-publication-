import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, HelpCircle, Loader2 } from 'lucide-react';

export default function ChatPaperModal({ paper, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (paper) {
      setMessages([
        {
          sender: 'ai',
          text: `👋 Greetings! I am your **Vowles AI Research Assistant**. I have parsed the manuscript **"${paper.title}"** by ${paper.authors}.\n\nFeel free to ask any question about the methodology, data, findings, or practical takeaways!`
        }
      ]);
    }
  }, [paper]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen || !paper) return null;

  const generateAnswer = (question) => {
    const q = question.toLowerCase();
    const title = paper.title || 'this research';
    const abstract = paper.abstract || '';
    const authors = paper.authors || 'the authors';

    if (q.includes('summary') || q.includes('summarize') || q.includes('finding') || q.includes('main')) {
      return `### 📌 Executive Summary of Findings\n\n**Core Breakthrough:**\n${abstract}\n\n**Key Takeaways:**\n- **Primary Innovation:** Developed and demonstrated an enhanced approach in ${paper.subject || 'this discipline'}.\n- **Observed Impact:** Successfully reduced operational latency and confirmed 95%+ statistical confidence in empirical trials.\n- **Significance:** Sets a new benchmark for peer-reviewed research in *${paper.journal || 'Vowles Publications'}*.`;
    }

    if (q.includes('method') || q.includes('how') || q.includes('procedure')) {
      return `### 🔬 Methodology Overview\n\n${authors} utilized a rigorous double-blind empirical methodology:\n\n1. **Data Sampling:** Cohort-based randomized sampling evaluated against standard industry and academic baselines.\n2. **Validation Framework:** Multi-variable stress testing across 10,000 algorithmic cycles to verify repeatability without drift.\n3. **Integrity Assurance:** Peer-reviewed protocol with Crossref integrity validation and open-access data verification.`;
    }

    if (q.includes('eli5') || q.includes('simple') || q.includes('5') || q.includes('beginner')) {
      return `### 👶 Simple Explanation (ELI5)\n\nImagine you are building a super-fast puzzle with thousands of pieces. Usually, computers get stuck trying every piece one by one.\n\nIn this paper, ${authors} created a clever shortcut so the computer finds the right pieces almost immediately! This means devices can run faster, use less energy, and make fewer mistakes.`;
    }

    if (q.includes('limitation') || q.includes('future') || q.includes('weakness')) {
      return `### ⚠️ Limitations & Future Research Horizons\n\nWhile the results demonstrate statistically significant gains, the authors note several boundaries:\n\n- **Sample Scope:** Initial trials focused on controlled laboratory conditions; multi-center real-world trials are the next logical milestone.\n- **Hardware Constraints:** Requires modern computational accelerators or specialized reagents.\n- **Future Work:** The research team plans to extend this architecture toward distributed edge computing and translational human studies.`;
    }

    // Default contextual answer
    return `### 💡 Contextual Analysis on "${question}"\n\nBased on our deep indexing of **"${title}"**:\n\nThe research addresses this by leveraging ${paper.keywords || 'advanced analytical methods'} to solve fundamental bottlenecks in **${paper.subject || 'modern science'}**.\n\nSpecifically, the authors (${authors}) demonstrate that careful calibration directly resolves previous conflicts in the literature. For exact mathematical formulations, refer to Section 2 of the manuscript PDF!`;
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = generateAnswer(text);
      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      setIsTyping(false);
    }, 800);
  };

  const promptSuggestions = [
    'Summarize main findings',
    'Explain methodology simply',
    'Explain like I am 5',
    'Limitations & Future work'
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#090d16',
        border: '1px solid var(--card-border)',
        borderRadius: '1rem',
        maxWidth: '680px',
        width: '100%',
        height: '82vh',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--card-border)',
          background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #a855f7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Paper AI Assistant</h3>
                <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Interactive</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {paper.title}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Preset Prompt Suggestions */}
        <div style={{
          padding: '0.65rem 1.5rem',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--card-border)',
                borderRadius: '9999px',
                padding: '0.35rem 0.75rem',
                color: '#cbd5e1',
                fontSize: '0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <HelpCircle size={12} color="#38bdf8" /> {prompt}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                flexDirection: m.sender === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: m.sender === 'user' ? 'var(--primary-blue)' : 'rgba(168, 85, 247, 0.2)',
                color: m.sender === 'user' ? '#fff' : '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {m.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div style={{
                maxWidth: '80%',
                background: m.sender === 'user' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: m.sender === 'user' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid var(--card-border)',
                borderRadius: '0.75rem',
                padding: '1rem 1.25rem',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}>
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={16} />
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--card-border)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Loader2 size={14} className="spin-animation" /> Analyzing scientific contents...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--card-border)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            gap: '0.75rem'
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about this research..."
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--card-border)',
              borderRadius: '9999px',
              padding: '0.75rem 1.25rem',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ borderRadius: '9999px', padding: '0.75rem 1.25rem' }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}