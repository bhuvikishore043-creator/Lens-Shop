import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';
import { X, Send, User, Eye } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    text: "Welcome to Lumina Optics AI Vision Assistant. I can help you find the perfect eyewear based on your face shape, prescription, and style preferences. Ask me anything!",
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
];

const QUICK_REPLIES = [
  "What frames suit a round face?",
  "Best lens for blue light blocking?",
  "How to read my prescription?",
  "Titanium vs acetate frames?"
];

const BOT_RESPONSES = {
  "round face": "For round faces, we recommend angular frames like rectangular or square silhouettes. Our **Aetherium Titanium Specs (lum-01)** with its architectural geometry would be an ideal match. Angular frames add definition and elongate facial features.",
  "blue light": "Our **Zeiss Anti-Blue Shield** lenses block up to 99.4% of harmful blue light from screens. You can customize any frame with Zeiss Anti-Blue coatings in our Studio Style Finder.",
  "prescription": "Your prescription contains:\n• **SPH**: Sphere (nearsighted = negative, farsighted = positive)\n• **CYL**: Cylinder (astigmatism correction)\n• **AXIS**: Angle of astigmatism\n• **PD**: Pupillary distance (vital for lens centering)\nYou can save your prescription in your Customer Dashboard for instant reuse.",
  "titanium": "**Titanium** frames weigh as little as 12g, offer hypoallergenic properties, and last decades. Ideal for daily wear professionals. **Acetate** frames offer richer color options and thicker artistic profiles, inspired by Gentle Monster aesthetics. Both carry our 2-year Lumina warranty.",
};

function getBotResponse(query) {
  const q = query.toLowerCase();
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (q.includes(key.split(' ')[0])) return response;
  }
  return "That's a great question about our eyewear collection! For personalized assistance, I recommend trying our **Studio Style Finder** or booking a **3D Retinal Scan & Custom Fitting** appointment with one of our optometrists. Would you like me to help you with that?";
}

export const AIVisionChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: msg,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: getBotResponse(msg),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <>
      {/* Chat Bubble Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl glass-button flex items-center justify-center shadow-glass-glow cursor-pointer hover:scale-105 transition-all"
          title="Lumina AI Vision Assistant"
        >
          <Eye className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 flex flex-col" style={{ maxHeight: '80vh' }}>
          <GlassCard className="flex flex-col overflow-hidden border border-white shadow-floating bg-white/95" style={{ maxHeight: '80vh' }}>
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur-glass shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-display font-black text-slate-900 block">
                    Lumina AI Vision
                  </span>
                  <span className="text-[10px] font-mono text-sky-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Online Assistant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${
                    msg.role === 'assistant'
                      ? 'bg-sky-100 border border-sky-300 text-sky-700'
                      : 'bg-slate-200 border border-slate-300 text-slate-700'
                  }`}>
                    {msg.role === 'assistant'
                      ? <Eye className="w-3.5 h-3.5" />
                      : <User className="w-3.5 h-3.5" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                      : 'bg-sky-600 text-white rounded-tr-sm shadow-sm font-medium'
                  }`}>
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i} className="block" dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, `<strong class="${msg.role === 'assistant' ? 'text-sky-800 font-bold' : 'text-white font-black'}">$1</strong>`)
                      }} />
                    ))}
                    <span className={`block text-[9px] mt-1.5 font-mono ${msg.role === 'assistant' ? 'text-slate-400' : 'text-sky-200'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700">
                    <Eye className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex gap-1 shadow-sm">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick Reply Chips */}
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide shrink-0 border-t border-slate-100 bg-white">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="whitespace-nowrap text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:border-sky-400 hover:text-sky-700 hover:bg-sky-50 transition-colors shrink-0"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 shrink-0 bg-white border-t border-slate-100">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-2 items-center bg-slate-50 rounded-xl border border-slate-200 pr-1.5 pl-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about frames, lenses, prescriptions..."
                  className="flex-1 bg-transparent text-xs text-slate-800 py-2.5 outline-none placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center hover:bg-sky-700 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </GlassCard>
        </div>
      )}
    </>
  );
};
