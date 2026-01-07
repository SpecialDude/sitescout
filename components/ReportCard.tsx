
import React from 'react';
import { SiteAnalysis } from '../types';

interface ReportCardProps {
  data: SiteAnalysis;
}

export const ReportCard: React.FC<ReportCardProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Summary */}
      <section className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Executive Summary</h2>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
            Verified
          </span>
        </div>
        <p className="text-slate-300 leading-relaxed text-lg mb-6">{data.summary}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-slate-800 pt-8">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Core Purpose</h3>
            <p className="text-slate-300">{data.purpose}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Operational Flow</h3>
            <p className="text-slate-300">{data.howItWorks}</p>
          </div>
        </div>
      </section>

      {/* Requirements Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-4 text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <h3 className="font-bold">Functional</h3>
          </div>
          <ul className="space-y-3 flex-1">
            {data.requirements.functional.map((item, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-4 text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            <h3 className="font-bold">Technical</h3>
          </div>
          <ul className="space-y-3 flex-1">
            {data.requirements.technical.map((item, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-4 text-purple-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <h3 className="font-bold">UX / Design</h3>
          </div>
          <ul className="space-y-3 flex-1">
            {data.requirements.userExperience.map((item, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start space-x-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Site Structure / Crawler Map */}
      <section className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
            <span>Site Mapping & Architecture</span>
          </h2>
        </div>
        <div className="divide-y divide-slate-800">
          {data.structure.map((item, i) => (
            <div key={i} className="p-6 hover:bg-slate-800/30 transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-indigo-400 font-mono text-sm font-bold mb-1 group-hover:text-indigo-300 transition-colors">
                    {item.page}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-slate-500 font-mono border border-slate-700 rounded px-1">200 OK</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Source Grounding */}
      {data.sources && data.sources.length > 0 && (
        <section className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Crawl Intelligence Sources</h3>
          <div className="flex flex-wrap gap-3">
            {data.sources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-all"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                <span className="max-w-[150px] truncate">{source.title}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
