import React from 'react';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function SavedPage({ savedItems = [], onDeleteSavedItem }) {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] dark:bg-aurqo-darkBg p-6 lg:p-8 text-gray-855 dark:text-gray-200 overflow-y-auto">
      <header className="mb-8 text-left">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-cyan-400" />
          Saved & Bookmarks
        </h2>
        <p className="text-xs text-gray-400 mt-1">Explore and manage saved AI generated queries, papers, and coding snippets.</p>
      </header>

      <div className="max-w-4xl w-full">
        {savedItems.length === 0 ? (
          <EmptyState
            title="No Bookmarked Items"
            description="When reviewing AI search response details, tap the star icon to catalog important content here."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {savedItems.map((item) => (
              <div 
                key={item.id}
                className="p-5 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl flex flex-col justify-between shadow-sm relative group"
              >
                <div className="text-left">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-aurqo-darkBorder/20 pb-3 mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                      Saved from: {item.title}
                    </span>
                    <button
                      onClick={() => onDeleteSavedItem(item.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-950/20 transition-all"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-750 dark:text-gray-300 leading-relaxed font-sans whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
                <div className="mt-4 text-[9px] text-gray-400 font-mono text-left">
                  Saved on: {item.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
