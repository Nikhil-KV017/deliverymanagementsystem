import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! I'm your Buddy AI. How can I help you today? I can recommend food or check your orders!", isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { restaurants, orders } = useData();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      let botResponse = "I'm still learning, but I can help you find restaurants! Try asking for 'pizza' or 'Indian'.";
      const query = input.toLowerCase();

      if (query.includes('pizza')) {
        const pizzaRes = restaurants.filter(r => r.cuisine.includes('Pizza'));
        botResponse = pizzaRes.length > 0 
          ? `I found ${pizzaRes.length} pizza places: ${pizzaRes.map(r => r.name).join(', ')}. Pizza Paradise is highly rated! 🍕`
          : "I couldn't find any pizza places right now, but Bombay Bites has great appetizers!";
      } else if (query.includes('order')) {
        botResponse = orders.length > 0 
          ? `You have ${orders.length} orders. Your latest order from ${orders[0].restaurantName} is currently: ${orders[0].status}.`
          : "You haven't placed any orders yet. Want some recommendations?";
      } else if (query.includes('hi') || query.includes('hello')) {
        botResponse = "Hello! Looking for something delicious today?";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (text) => {
    setInput(text);
    // Auto send in next frame
    setTimeout(() => {
      document.querySelector('.chatbot-input button').click();
    }, 100);
  };

  return (
    <div className="ai-chatbot-container">
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
          <span className="badge">AI</span>
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-info">
              <div className="bot-avatar"><Bot size={20} /></div>
              <div>
                <h4>Buddy AI</h4>
                <span className="status">Online & Helpful</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message-wrapper ${msg.isBot ? 'bot' : 'user'}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-wrapper bot">
                <div className="message-content typing">
                  <Loader2 size={16} className="spin" />
                  Buddy is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-actions">
            <button className="q-chip" onClick={() => handleQuickAction("Find Pizza 🍕")}>Pizza</button>
            <button className="q-chip" onClick={() => handleQuickAction("Order Status 📦")}>Order Status</button>
            <button className="q-chip" onClick={() => handleQuickAction("Help ❓")}>Help</button>
          </div>

          <div className="chatbot-input">
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .ai-chatbot-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }

        .chatbot-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          border: none;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        .chatbot-toggle:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .chatbot-toggle .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: white;
          color: var(--primary);
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .chatbot-window {
          width: 360px;
          height: 520px;
          background: rgba(26, 26, 26, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          overflow: hidden;
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideIn {
          from { transform: translateY(40px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .chatbot-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(34, 197, 94, 0.9) 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info { display: flex; gap: 12px; align-items: center; }
        .bot-avatar { width: 40px; height: 40px; background: rgba(255,255,255,0.25); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .header-info h4 { margin: 0; font-size: 1.1rem; font-weight: 800; }
        .header-info .status { font-size: 0.75rem; font-weight: 600; opacity: 0.9; }
        .close-btn { background: rgba(255,255,255,0.15); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
        .close-btn:hover { background: rgba(255,255,255,0.3); transform: rotate(90deg); }

        .chatbot-messages {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: transparent;
        }

        .message-wrapper { display: flex; max-width: 85%; }
        .message-wrapper.bot { align-self: flex-start; }
        .message-wrapper.user { align-self: flex-end; }

        .message-content {
          padding: 0.85rem 1.1rem;
          border-radius: 18px;
          font-size: 0.92rem;
          line-height: 1.5;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .bot .message-content { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); border-bottom-left-radius: 4px; color: var(--text-main); }
        .user .message-content { background: var(--primary); color: white; border-bottom-right-radius: 4px; box-shadow: 0 4px 15px rgba(255,107,53,0.3); }

        .typing { display: flex; align-items: center; gap: 8px; font-style: italic; color: var(--text-muted); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .quick-actions {
          padding: 0 1.5rem 0.5rem 1.5rem;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .quick-actions::-webkit-scrollbar { display: none; }
        
        .q-chip {
          padding: 6px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s;
        }
        .q-chip:hover { background: rgba(255,107,53,0.1); border-color: var(--primary); color: var(--primary); }

        .chatbot-input {
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          gap: 12px;
        }

        .chatbot-input input {
          flex: 1;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 0.75rem 1.25rem;
          color: var(--text-main);
          font-size: 0.95rem;
          font-family: var(--font-family);
        }

        .chatbot-input input:focus { outline: none; border-color: var(--primary); }

        .chatbot-input button {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .chatbot-input button:disabled { opacity: 0.5; cursor: not-allowed; }
        .chatbot-input button:not(:disabled):hover { transform: scale(1.1); }
      `}</style>
    </div>
  );
}

