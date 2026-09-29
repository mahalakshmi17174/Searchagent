import React from 'react';
import { ArrowRight, X } from 'lucide-react';
import { sectionRoutes } from '../data/sectionRoutes';

export default function SectionSuggestion({ section, onSwitch, onClose }) {
  if (!section) return null;
  
  const route = sectionRoutes.find(r => r.section === section);
  if (!route) return null;

  const Icon = route.icon;

  return (
    <div className="relative flex items-center justify-between gap-4 p-3.5 rounded-2xl border border-[#d9dffd] dark:border-aurqo-darkBorder bg-[#eef2ff] dark:bg-aurqo-darkCard/80 shadow-md transition-all animate-in slide-in-from-bottom-2 duration-150 mb-3 text-left">
      
      {/* Left side: Icon and labels */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="p-2.5 rounded-xl bg-[#cbd5ff] dark:bg-purple-950/40 text-[#2c1eb7] dark:text-purple-400 flex-shrink-0 flex items-center justify-center">
          <Icon className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-[#2c1eb7] dark:text-purple-300 leading-snug">
            This request belongs to the {route.name} section.
          </h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-normal mt-0.5">
            Click below to navigate to the specialized module.
          </p>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Navigation button */}
        <button
          type="button"
          onClick={() => {
            onSwitch(route.destination);
            onClose();
          }}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#4f3ef5] hover:bg-[#3d2ce0] text-white text-[10px] font-extrabold rounded-xl transition-colors select-none uppercase tracking-wider shadow-sm"
        >
          GO TO {route.name.toUpperCase()} &rarr;
        </button>

        {/* Dismiss Icon */}
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200/40 dark:hover:bg-aurqo-darkHover/30 transition-colors"
          title="Dismiss suggestion"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
