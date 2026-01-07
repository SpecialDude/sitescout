
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { ReportCard } from './components/ReportCard';
import { ChatInterface } from './components/ChatInterface';
import { geminiService } from './services/geminiService';
import { SiteAnalysis, AnalysisStatus, HistoryItem, AppView } from './types';
import { HistoryPage } from './HistoryPage';
import { DocsPage } from './DocsPage';
import { exportToMarkdown, exportToJSON } from './services/exportService';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [view, setView] = useState<AppView>(AppView.ANALYZER);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SiteAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [progressMsg, setProgressMsg] = useState('Initializing crawler...');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sitescout_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToHistory = useCallback((data: SiteAnalysis) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: data.url,
      timestamp: Date.now(),
      data
    };
    const updated = [newItem, ...history.filter(h => h.url !== data.url)].slice(0, 15);
    setHistory(updated);
    localStorage.setItem('sitescout_history', JSON.stringify(updated));
  }, [history]);

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('sitescout_history', JSON.stringify(updated));
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;

    let formattedUrl = url;
    if (!url.startsWith('http')) {
      formattedUrl = `https://${url}`;
    }

    setView(AppView.ANALYZER);
    setStatus(AnalysisStatus.CRAWLING);
    setError(null);
    setAnalysis(null);

    const messages = [
      'Simulating web-head browsing...',
      'Mapping site hierarchy...',
      'Discovering public endpoints...',
      'Analyzing business logic patterns...',
      'Synthesizing structural requirements...',
      'Validating data grounding...'
    ];

    let msgIdx = 0;
    const interval = setInterval(() => {
      setProgressMsg(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 3000);

    try {
      const result = await geminiService.analyzeWebsite(formattedUrl);
      setAnalysis(result);
      setStatus(AnalysisStatus.COMPLETED);
      saveToHistory(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during crawling.');
      setStatus(AnalysisStatus.ERROR);
    } finally {
      clearInterval(interval);
    }
  };

  const selectFromHistory = (data: SiteAnalysis) => {
    setAnalysis(data);
    setStatus(AnalysisStatus.COMPLETED);
    setView(AppView.ANALYZER);
  };

  const reset = () => {
    setStatus(AnalysisStatus.IDLE);
    setAnalysis(null);
    setError(null);
    setUrl('');
    setView(AppView.ANALYZER);
  };

  const renderContent = () => {
    switch (view) {
      case AppView.DOCS:
        return <DocsPage />;
      
      case AppView.HISTORY:
        return (
          <HistoryPage 
            history={history} 
            onSelect={selectFromHistory} 
            onDelete={deleteHistoryItem}
          />
        );

      case AppView.ANALYZER:
      default:
        return (
          <div className="space-y-12">
            {status === AnalysisStatus.IDLE && (
              <div className="max-w-4xl mx-auto text-center space-y-6 pt-12 animate-in fade-in zoom-in duration-700">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span>Next-Gen Intelligence Live</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  Reverse Engineer <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Any Website</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                  Deep-crawl any domain to extract business requirements, technical stacks, 
                  user flows, and functional specifications in seconds.
                </p>

                <form onSubmit={handleAnalyze} className="max-w-xl mx-auto flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl focus-within:border-indigo-500 transition-all duration-300">
                  <input 
                    type="text" 
                    placeholder="Enter domain (e.g. stripe.com)"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white px-6 py-4 placeholder:text-slate-600"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={!url || status !== AnalysisStatus.IDLE}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Launch Scout
                  </button>
                </form>
              </div>
            )}

            {status === AnalysisStatus.CRAWLING && (
              <div className="min-h-[400px] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-white tracking-wide">{progressMsg}</h3>
                  <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Intercepting domain packets...</p>
                </div>
              </div>
            )}

            {status === AnalysisStatus.ERROR && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center space-y-4 animate-in slide-in-from-top-4 duration-300 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Analysis Failed</h2>
                <p className="text-slate-400">{error}</p>
                <button onClick={reset} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Try Again</button>
              </div>
            )}

            {status === AnalysisStatus.COMPLETED && analysis && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm sticky top-20 z-40 no-print">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white leading-tight">{analysis.url}</h2>
                      <p className="text-slate-500 text-xs font-mono tracking-tight">Intelligence Map v1.0 • Generated {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative" ref={exportMenuRef}>
                      <button 
                        onClick={() => setShowExportOptions(!showExportOptions)}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all text-sm font-medium border border-slate-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>Export Report</span>
                      </button>
                      
                      {showExportOptions && (
                        <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <button 
                            onClick={() => { window.print(); setShowExportOptions(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors text-sm flex items-center space-x-3"
                          >
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            <span>Download PDF (Print)</span>
                          </button>
                          <button 
                            onClick={() => { exportToMarkdown(analysis); setShowExportOptions(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors text-sm flex items-center space-x-3"
                          >
                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <span>Download Markdown (.md)</span>
                          </button>
                          <button 
                            onClick={() => { exportToJSON(analysis); setShowExportOptions(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors text-sm flex items-center space-x-3"
                          >
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            <span>Export Data (.json)</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <button onClick={reset} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all text-sm font-bold shadow-lg shadow-indigo-500/20">New Scan</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-8">
                    <ReportCard data={analysis} />
                  </div>
                  <div className="lg:col-span-1 sticky top-48 no-print">
                    <ChatInterface analysis={analysis} />
                  </div>
                </div>
              </div>
            )}

            {status === AnalysisStatus.IDLE && history.length > 0 && (
              <div className="space-y-6 pt-12 border-t border-slate-900 animate-in fade-in duration-1000 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Intelligence Reports</h3>
                  <button onClick={() => setView(AppView.HISTORY)} className="text-xs text-indigo-400 font-bold hover:underline">View All History</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history.slice(0, 4).map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => selectFromHistory(item.data)}
                      className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 hover:bg-slate-800/50 transition-all text-left group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.url}</h4>
                          <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Layout currentPage={view} onNavigate={setView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
