import React from 'react';
import { Grid, Sparkles } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import { mockTools } from '../data/tools';

export default function MoreTools() {
  const handleLaunchTool = (toolTitle) => {
    alert(`Launching ${toolTitle}... (Placeholder workspace loading)`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] dark:bg-aurqo-darkBg p-6 lg:p-8 text-gray-855 dark:text-gray-200 overflow-y-auto">
      <header className="mb-8 text-left">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center gap-2">
          <Grid className="w-5 h-5 text-cyan-400" />
          More Developer Tools
        </h2>
        <p className="text-xs text-gray-400 mt-1">Access advanced model settings, inspect token limits, and fine-tune datasets.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {mockTools.map((tool) => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            desc={tool.desc}
            status={tool.status}
            icon={tool.icon}
            onLaunch={() => handleLaunchTool(tool.title)}
          />
        ))}
      </div>
    </div>
  );
}
