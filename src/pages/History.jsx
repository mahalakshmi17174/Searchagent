import React from 'react';
import { History, Search, Image, Video, Volume2, BookOpen, Clock, Play } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const typeMeta = {
  search: { label: 'General Search', icon: Search, color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' },
  image: { label: 'Image Creator', icon: Image, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400' },
  video: { label: 'Video Creator', icon: Video, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' },
  audio: { label: 'Audio Synthesis', icon: Volume2, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
  research: { label: 'Research Center', icon: BookOpen, color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' }
};

export default function HistoryPage({ history = [], onSelectHistoryItem }) {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] dark:bg-aurqo-darkBg p-6 lg:p-8 text-gray-855 dark:text-gray-200 overflow-y-auto">
      <header className="mb-8 text-left">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          Generation History
        </h2>
        <p className="text-xs text-gray-400 mt-1">Audit previous searches, dynamically created domain logs, and visual creations.</p>
      </header>

      <div className="max-w-4xl w-full">
        {history.length === 0 ? (
          <EmptyState
            title="History Log Empty"
            description="All dynamic searches, domain allocations, and asset files generated will be indexed here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((item) => {
              const meta = typeMeta[item.type] || typeMeta.search;
              const Icon = meta.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectHistoryItem(item)}
                  className="flex items-center justify-between p-4 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl hover:border-purple-500/20 dark:hover:border-purple-500/25 transition-all shadow-sm cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Icon type */}
                    <div className={`p-2.5 rounded-xl ${meta.color} flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                          {meta.label}
                        </span>
                        {item.domain && (
                          <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400">
                            {item.domain}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate mt-1 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right flex-shrink-0">
                    <div className="hidden sm:flex flex-col text-[10px] text-gray-400 font-semibold gap-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp.split(' ')[1] || item.timestamp}
                      </span>
                      <span>{item.timestamp.split(' ')[0]}</span>
                    </div>
                    <Play className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
