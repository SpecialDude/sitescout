
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: AppView;
  onNavigate: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header role="banner" className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate(AppView.ANALYZER)}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            aria-label="SiteScout AI Home"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">SiteScout <span className="text-indigo-400">AI</span></h1>
          </button>
          
          <nav role="navigation" aria-label="Main Navigation" className="flex items-center space-x-2 md:space-x-6 text-sm font-medium">
            {[
              { id: AppView.ANALYZER, label: 'Analyzer' },
              { id: AppView.DOCS, label: 'Docs' },
              { id: AppView.HISTORY, label: 'History' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                aria-current={currentPage === tab.id ? 'page' : undefined}
                className={`px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  currentPage === tab.id 
                    ? 'text-white bg-slate-800' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main role="main" className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
      <footer role="contentinfo" className="border-t border-slate-900 bg-slate-950/50 py-8 text-center text-slate-500 text-sm no-print">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2024 SiteScout AI. Powered by Gemini 3 Intelligence Synthesis.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] uppercase font-bold tracking-tighter">Systems Operational</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
