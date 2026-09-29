import React from 'react';
import { Menu } from 'lucide-react';
import AuroqLogo from './AuroqLogo';

export default function Header({ onOpenSidebar }) {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-2 bg-white dark:bg-aurqo-darkSidebar border-b border-gray-200 dark:border-aurqo-darkBorder/40 select-none z-30">
      <button 
        onClick={onOpenSidebar}
        className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-aurqo-darkHover/40 transition-colors"
        title="Open sidebar"
      >
        <Menu className="w-5.5 h-5.5" />
      </button>

      <div className="w-8" />
    </header>
  );
}
