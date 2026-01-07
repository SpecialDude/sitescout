
import React from 'react';
import { HistoryItem, SiteAnalysis } from './types';

interface HistoryPageProps {
  history: HistoryItem[];
  onSelect: (analysis: SiteAnalysis) => void;
  onDelete: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-700">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">No History Yet</h2>
        <p className="text-slate-400 max-w-sm">Scans you perform will appear here for future reference and deep-dive analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between border-b border-slate-900 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white">Scan Archive</h2>
          <p className="text-slate-500">Access your historical site intelligence reports.</p>
        </div>
        <div className="text-sm font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          {history.length} Reports Cached
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div key={item.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="text-slate-600 hover:text-red-500 p-1 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 truncate">{item.url}</h3>
              <p className="text-xs text-slate-500 font-mono mb-4">
                {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                {item.data.summary}
              </p>
            </div>
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {item.data.structure.length} Pages Mapped
              </span>
              <button 
                onClick={() => onSelect(item.data)}
                className="text-indigo-400 hover:text-indigo-300 font-bold text-xs flex items-center space-x-1"
              >
                <span>View Report</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
