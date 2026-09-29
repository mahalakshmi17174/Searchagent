import React from 'react';
import { Search, Image, Video, Volume2, BookOpen, Grid, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home({ setCurrentView }) {
  const { currentUser } = useAuth();

  const shortcuts = [
    { id: 'general', name: 'General Search', desc: 'Ask questions, classify topics, and route special prompts.', icon: Search, color: 'text-purple-500 bg-purple-500/10' },
    { id: 'image', name: 'Image Creator', desc: 'Generate high-quality illustrations and graphics from descriptions.', icon: Image, color: 'text-cyan-500 bg-cyan-500/10' },
    { id: 'video', name: 'Video Creator', desc: 'Synthesize detailed short-form cinematic videos.', icon: Video, color: 'text-indigo-500 bg-indigo-500/10' },
    { id: 'audio', name: 'Audio Synthesis', desc: 'Create realistic voices, sound effects, or narrations.', icon: Volume2, color: 'text-emerald-500 bg-emerald-500/10' },
    { id: 'research', name: 'Research Center', desc: 'Synthesize scientific references and generate papers.', icon: BookOpen, color: 'text-amber-500 bg-amber-500/10' },
    { id: 'tools', name: 'More Developer Tools', desc: 'Access tokenizers, fine-tuning tools, and model metrics.', icon: Grid, color: 'text-rose-500 bg-rose-500/10' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] dark:bg-aurqo-darkBg p-6 lg:p-8 text-gray-800 dark:text-gray-200 overflow-y-auto">
      <header className="mb-10 text-left max-w-4xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Welcome back, <span className="gradient-text dark:gradient-text-alt">{currentUser?.name || 'User'}</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Access all dynamic models, manage search classification, and launch specialized generation tools.
        </p>
      </header>

      <div className="max-w-5xl">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-5 text-left">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className="group p-5 bg-white dark:bg-[#0f111b] border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className={`p-2.5 rounded-xl inline-block ${item.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-4">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-5 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                  <span>Open workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
