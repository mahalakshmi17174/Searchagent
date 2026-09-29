import { Cpu, Settings2, ShieldAlert, BarChart3, Database } from 'lucide-react';

export const mockTools = [
  {
    id: 'fine-tune',
    title: 'Fine-Tuning Portal',
    desc: 'Adapt models with custom datasets to specialize performance on custom business domains.',
    status: 'Beta',
    icon: Cpu
  },
  {
    id: 'tokenizer',
    title: 'Tokenizer Analyzer',
    desc: 'Inspect token counts and encoding boundaries to optimize prompt cost and context window usage.',
    status: 'Stable',
    icon: Settings2
  },
  {
    id: 'diagnostics',
    title: 'System Diagnostics',
    desc: 'Monitor API response speeds, model loads, token throughput, and overall endpoint health.',
    status: 'Internal',
    icon: ShieldAlert
  },
  {
    id: 'optimizer',
    title: 'Prompt Optimizer',
    desc: 'Automatically refine and structure developer prompts to improve LLM reasoning accuracy.',
    status: 'Stable',
    icon: BarChart3
  },
  {
    id: 'inspector',
    title: 'Semantic Model Inspector',
    desc: 'Visualize embeddings and inspect vector space clusters to debug search query relevance.',
    status: 'Beta',
    icon: Database
  }
];
