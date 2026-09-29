import React from 'react';
import { 
  Utensils, 
  Cpu, 
  Scissors, 
  GraduationCap, 
  ChevronRight, 
  Sparkles,
  Search
} from 'lucide-react';

export const DOMAIN_OPTIONS = [
  {
    id: 'Food',
    name: 'Food Domain',
    category: 'Food',
    type: 'domain',
    description: 'Recipes, dishes, cooking & ingredients (e.g. dosa, biryani)',
    icon: Utensils,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
  },
  {
    id: 'Technology',
    name: 'Technology Domain',
    category: 'Technology',
    type: 'domain',
    description: 'Coding, software, web, AI models & developer tools',
    icon: Cpu,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
  },
  {
    id: 'Textiles',
    name: 'Textiles Domain',
    category: 'Textiles',
    type: 'domain',
    description: 'Fabrics, cotton, silk, apparel, weaving & garment care',
    icon: Scissors,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
  },
  {
    id: 'Education',
    name: 'Education Domain',
    category: 'Education',
    type: 'domain',
    description: 'Study guides, courses, math, sciences & academic topics',
    icon: GraduationCap,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
  }
];

export default function SlashCommandMenu({ 
  items, 
  selectedIndex, 
  onSelect, 
  detectedDomain,
  userQuery 
}) {
  if (!items || items.length === 0) return null;

  return (
    <div 
      className="absolute bottom-full mb-3 left-0 right-0 bg-white dark:bg-[#131522] border border-gray-200/80 dark:border-aurqo-darkBorder rounded-[22px] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      {/* Top Banner when a query is typed after / (e.g. /dosa) */}
      {userQuery && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-[#191b2b] border-b border-gray-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Search prompt: <span className="font-bold text-gray-900 dark:text-white">"{userQuery}"</span></span>
          </div>
          {detectedDomain && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300/50 dark:border-purple-800/60">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>Categorized: {detectedDomain}</span>
            </div>
          )}
        </div>
      )}

      {/* Domain Options List */}
      <div className="p-2 max-h-[320px] overflow-y-auto space-y-1">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = idx === selectedIndex;
          const isMatchedDomain = detectedDomain && (item.category === detectedDomain || item.id === detectedDomain);

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/70 shadow-sm'
                  : 'hover:bg-gray-50 dark:hover:bg-aurqo-darkHover/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`p-2.5 rounded-xl flex-shrink-0 border ${item.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {item.name}
                    </span>
                    {isMatchedDomain && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                        <Sparkles className="w-2.5 h-2.5" /> Auto-Detected
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {item.description}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.category}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-600 dark:text-blue-400 translate-x-0.5' : 'text-gray-400'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
