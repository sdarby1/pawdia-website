'use client';

import { useState, useRef, useEffect } from 'react';

const FaqBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null); // Ref fürs Scrollen

  const toggleBot = () => {
    setIsOpen(!isOpen);
  };

  // Auto-Scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: 'user', content: input }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/chat-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        setError('Oops, da ging etwas schief.');
        setIsLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botReply = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        botReply += decoder.decode(value, { stream: true });
        setMessages(prev => [
          ...updatedMessages,
          { role: 'assistant', content: botReply },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError('Fehler beim Senden der Nachricht.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Toggle Button */}
      <button className="faqbot-toggle-button" onClick={toggleBot}>
        🐶
      </button>

      {/* Chatfenster */}
      {isOpen && (
        <div className="faqbot-modal">
          <div className="faqbot-header">
            <h3>Pawdia FAQ-Bot 🐶</h3>
            <button onClick={toggleBot} className='close-modal-btn'>✖</button>
          </div>

          <div className="faqbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'Du' : 'Pawdia-Bot'}:</strong> {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="message assistant"><em>Pawdia-Bot schreibt...</em></div>
            )}
            <div ref={messagesEndRef} /> {/* Scrollziel */}
          </div>

          <form onSubmit={handleSubmit} className="faqbot-input-form">
            <input
              type="text"
              value={input}
              placeholder="Frag mich etwas über Pawdia..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={isLoading}>Senden</button>
          </form>

          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </>
  );
};

export default FaqBot;
