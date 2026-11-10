import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  ChevronRight, 
  Minimize2, 
  Maximize2, 
  ArrowRight,
  TrendingUp,
  Shield,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import PlayerImage from './PlayerImage';
import { queryAssistant } from '../services/api';

const SUGGESTIONS = [
  "Top 3 death bowlers for RR",
  "Compare Rinku Singh and David Miller",
  "Why target Matheesha Pathirana?",
  "Spinners with econ under 7.0",
  "Rajasthan Royals 4 auction priorities"
];

export default function ScoutingAssistant({ onSelectPlayer }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I am Royal Scout AI, your intelligence assistant for IPL 2027 auction planning. Ask me about player pressure telemetry, death-overs specialists, head-to-head match-ups, or Rajasthan Royals tactical fits.",
      players: []
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const data = await queryAssistant(q);
      
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: data.answer || "No verified data found for that query.",
          players: data.players || []
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "I encountered an issue connecting to the analytics engine. Please try again.",
          players: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-royal-pink via-pink-600 to-royal-blue text-white shadow-2xl hover:shadow-royal-glow transition-all duration-300 transform hover:-translate-y-1 border border-white/20"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-royal-gold animate-pulse" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-display font-black tracking-wide leading-tight">
              Ask Scout AI
            </span>
            <span className="block text-[10px] text-pink-100 font-medium">
              IPL 2027 Intelligence
            </span>
          </div>
        </button>
      )}

      {/* Assistant Modal / Console Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[440px] h-[580px] max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-navy-750">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-royal-pink to-royal-blue flex items-center justify-center text-white shadow-royal-glow">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-black text-sm text-white flex items-center space-x-1.5">
                  <span>ROYAL SCOUT ASSISTANT</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  Grounded in 2022–2026 match telemetry
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-navy-900/60 text-xs">
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[88%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-royal-pink text-white rounded-br-none shadow-sm'
                      : 'bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-navy-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>

                {/* Attached Player Cards if present */}
                {m.players && m.players.length > 0 && (
                  <div className="mt-2.5 space-y-1.5 w-full max-w-[90%]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">
                      Referenced Profiles ({m.players.length})
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {m.players.map(p => {
                        const pid = p.player_id || p.striker_id || p.bowler_id;
                        return (
                          <div
                            key={pid}
                            onClick={() => {
                              if (onSelectPlayer && pid) {
                                onSelectPlayer(pid);
                              }
                            }}
                            className="cursor-pointer p-2 rounded-xl bg-white dark:bg-navy-850 hover:bg-slate-100 dark:hover:bg-navy-750 border border-slate-200 dark:border-navy-700 flex items-center justify-between transition-colors shadow-sm"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <PlayerImage 
                                playerId={pid}
                                name={p.player_name || p.name}
                                imageUrl={p.image_url || (pid ? `/players/${pid}.jpg` : null)}
                                role={p.primary_role || p.role || p.category}
                                size="sm"
                              />
                              <div className="truncate">
                                <span className="font-bold text-slate-900 dark:text-white block truncate leading-tight">
                                  {p.player_name || p.name}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                                  {p.primary_role || p.role || p.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5 shrink-0 pl-2">
                              <span className="font-bold text-royal-pink font-mono text-[11px]">
                                {p.overall_pri || p.pri_score || p.bpri || p.bopri} PRI
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 p-3 bg-white dark:bg-navy-800 rounded-2xl w-28 border border-slate-200 dark:border-navy-700">
                <div className="w-2 h-2 rounded-full bg-royal-pink animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-royal-gold animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-royal-blue animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Chips */}
          <div className="px-3 py-2 bg-slate-100 dark:bg-navy-950 border-t border-slate-200 dark:border-navy-800 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-navy-700 hover:border-royal-pink dark:hover:border-royal-pink transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-navy-900 border-t border-slate-200 dark:border-navy-750 flex items-center space-x-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about players, death overs, auction fit..."
              className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-navy-700 focus:outline-none focus:border-royal-pink transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || loading}
              className="p-2 rounded-xl bg-royal-pink hover:bg-royal-pink-hover text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-royal-glow"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

