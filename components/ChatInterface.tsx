
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SiteAnalysis } from '../types';
import { geminiService } from '../services/geminiService';

interface ChatInterfaceProps {
  analysis: SiteAnalysis;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ analysis }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const { answer, isDeepDive, sources } = await geminiService.askFollowUp(analysis.url, analysis, input);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: answer,
        isDeepDive,
        sources
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I encountered an error while deep-diving into the site." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[600px] overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center space-x-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span>Intelligence Chat</span>
        </h3>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Live Context: {analysis.url}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-40">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm">Ask about specific forms, pricing, <br/>or site logic to trigger a deep-dive scan.</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
              {msg.isDeepDive && (
                <div className="flex items-center space-x-1.5 mb-2 text-[10px] font-bold text-cyan-400 uppercase tracking-tighter">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>Deep-Dive Scan Triggered</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((s, idx) => (
                      <a 
                        key={idx} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-slate-900/50 hover:bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-indigo-400 truncate max-w-[120px]"
                      >
                        {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 flex space-x-2 items-center">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-[10px] text-slate-500 font-mono ml-2">SCOUTING...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="relative flex items-center">
          <input 
            type="text"
            placeholder="Ask a follow-up question..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors pr-12"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 rounded-lg text-white disabled:opacity-50 hover:bg-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
};
