import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = "No items found", description = "There is no content in this section yet." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-200 dark:border-aurqo-darkBorder/40 rounded-2xl max-w-md mx-auto bg-gray-50/50 dark:bg-aurqo-darkCard/10 mt-6">
      <Inbox className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-3 animate-pulse" />
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed max-w-[280px]">
        {description}
      </p>
    </div>
  );
}
