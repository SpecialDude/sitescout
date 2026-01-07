
import React from 'react';

export const DocsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-white tracking-tight">Technical Documentation</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          SiteScout AI uses high-density language models to perform simulated browsing and structural analysis of public web domains.
        </p>
      </div>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-white border-b border-slate-900 pb-2">How it Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-widest">Stage 1: Reconnaissance</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              When a URL is submitted, SiteScout initiates a search-grounded mapping process. It identifies main landing pages, product pages, legal documents, and subdomains to build a logical hierarchy.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Stage 2: Feature Extraction</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gemini 3 analyzes the textual and structural content of the crawled pages to reverse-engineer functional requirements, technical stacks, and UX patterns.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span>Advanced Feature: Deep-Dive</span>
        </h3>
        <p className="text-slate-300">
          The <strong>Intelligence Chat</strong> isn't just a simple chatbot. When you ask specific questions about details not found in the initial summary (e.g., "What fields are in the signup form?"), the model triggers a <span className="text-cyan-400 font-mono">Deep-Dive Scan</span>.
        </p>
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
          <code className="text-indigo-300 text-sm font-mono block whitespace-pre">
            {`// Triggering Logic
if (question.needs_specifics) {
  await useGoogleSearchTool(specific_query);
  return synthesized_deep_data;
}`}
          </code>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-white border-b border-slate-900 pb-2">Capabilities</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Sitemap Discovery", desc: "Automated mapping of site hierarchy and public routing." },
            { title: "Business Logic Mapping", desc: "Identifying core value propositions and conversion goals." },
            { title: "Tech Stack Inference", desc: "Predicting technical requirements and integrations." },
            { title: "Requirement Generation", desc: "Drafting functional specifications for development teams." },
            { title: "Form Analysis", desc: "Deep-scouting specific user input fields and validation logic." },
            { title: "Historical Comparisons", desc: "Reviewing past scan reports to track site evolution." }
          ].map((cap, i) => (
            <li key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <h5 className="text-white font-bold text-sm mb-1">{cap.title}</h5>
              <p className="text-slate-500 text-xs">{cap.desc}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
