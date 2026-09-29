import React from 'react';
import { Settings, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, desc: 'Classic bright workspace' },
    { id: 'dark', name: 'Dark', icon: Moon, desc: 'Comfortable dark interface' },
    { id: 'system', name: 'System', icon: Monitor, desc: 'Syncs with device colors' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] dark:bg-aurqo-darkBg p-6 lg:p-8 text-gray-855 dark:text-gray-200 overflow-y-auto">
      <header className="mb-8 text-left">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          System Settings
        </h2>
        <p className="text-xs text-gray-400 mt-1">Configure layout themes, system modes, and model options.</p>
      </header>

      <div className="max-w-2xl space-y-6 text-left">
        {/* Theme Settings Section */}
        <div className="bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-4 block">Application Theme</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    theme === t.id
                      ? 'border-blue-600 bg-blue-50/20 text-blue-700 dark:text-blue-400 shadow-sm ring-2 ring-blue-600/10'
                      : 'border-gray-200/50 dark:border-aurqo-darkBorder/40 text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-aurqo-darkInput/40 hover:bg-gray-100 dark:hover:bg-aurqo-darkHover/40'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-2" />
                  <span className="text-xs font-bold">{t.name}</span>
                  <span className="text-[9px] text-gray-400 mt-1">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mock Model Preference */}
        <div className="bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block">AI Engine Preferences</h3>
          
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-aurqo-darkBorder/20 pb-4">
            <div>
              <h4 className="text-xs font-bold text-gray-800 dark:text-white">Default Model Preference</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Primary model selection for general queries.</p>
            </div>
            <select className="bg-gray-50 dark:bg-aurqo-darkInput border border-gray-200 dark:border-aurqo-darkBorder rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white font-medium outline-none focus:ring-1 focus:ring-blue-500">
              <option>Tamili AI 2.0 (Default)</option>
              <option>Tamili Lite (Fast)</option>
              <option>Tamili Reasoning (Deep Search)</option>
            </select>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 dark:border-aurqo-darkBorder/20 pb-4">
            <div>
              <h4 className="text-xs font-bold text-gray-800 dark:text-white">Strict Classification Guard</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Toggle strict domain mapping filters on simple prompts.</p>
            </div>
            <button className="w-9 h-5 rounded-full bg-blue-600 relative flex items-center justify-end px-0.5 shadow-inner">
              <span className="w-4 h-4 bg-white rounded-full shadow" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-800 dark:text-white">Billing Tier</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Your monthly subscription level.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">
              Active: Free Tier
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
