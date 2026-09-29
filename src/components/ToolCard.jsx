import React from 'react';

export default function ToolCard({ title, desc, status, icon: Icon, onLaunch }) {
  return (
    <div className="p-5 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl flex flex-col justify-between hover:bg-purple-50/20 dark:hover:bg-aurqo-darkHover/40 hover:border-purple-500/25 dark:hover:border-purple-500/25 transition-all shadow-sm group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
            status === 'Stable' 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : status === 'Beta' 
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
          }`}>
            {status}
          </span>
        </div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{desc}</p>
      </div>
      <button 
        onClick={onLaunch}
        className="mt-5 text-[11px] font-extrabold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-left uppercase tracking-wider inline-flex items-center gap-1"
      >
        Launch tool &rarr;
      </button>
    </div>
  );
}
