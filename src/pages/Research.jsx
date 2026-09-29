import React, { useState, useEffect } from 'react';
import { startResearch, generateResearchPaper } from '../services/researchService';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { BookOpen, Send, RefreshCw, FileText, ArrowRight, CheckCircle, Database } from 'lucide-react';
import { loadUserData, saveUserData } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

export default function ResearchPage({ setIsResponding }) {
  const { currentUser } = useAuth();
  const [topic, setTopic] = useState('');
  const [researchMode, setResearchMode] = useState('summary'); // summary, paper
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, researching, compiling, completed, failed
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (setIsResponding) {
      setIsResponding(loading);
    }
  }, [loading, setIsResponding]);
  
  // Previous research history
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser?.userId) {
      const savedHistory = loadUserData(currentUser.userId, 'researchHistory', []);
      setHistory(savedHistory);
    }
  }, [currentUser]);

  const handleStartResearch = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim() || loading) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      if (researchMode === 'summary') {
        setStatus('researching');
        const data = await startResearch(topic);
        setResult(data);
        setStatus('completed');

        const newHistory = [{ id: data.id, topic: data.topic, mode: 'summary', createdAt: data.createdAt, data }, ...history];
        setHistory(newHistory);
        saveUserData(currentUser.userId, 'researchHistory', newHistory);
      } else {
        // Full paper generation flow simulation
        setStatus('researching');
        await new Promise(r => setTimeout(r, 800));
        setStatus('compiling');
        
        const paper = await generateResearchPaper(topic);
        setResult(paper);
        setStatus('completed');

        const newHistory = [{ id: paper.id, topic: paper.topic, mode: 'paper', createdAt: paper.createdAt, data: paper }, ...history];
        setHistory(newHistory);
        saveUserData(currentUser.userId, 'researchHistory', newHistory);
      }
    } catch (err) {
      setStatus('failed');
      setError(err.message || 'An error occurred during research collection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] dark:bg-aurqo-darkBg p-6 lg:p-8 text-gray-855 dark:text-gray-200 overflow-y-auto">
      <header className="mb-8 text-left">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          Research Center & Paper Compiler
        </h2>
        <p className="text-xs text-gray-400 mt-1">Compile comprehensive research reviews, cross-reference sources, and write publications.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs & Settings */}
        <div className="lg:col-span-5 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl p-6 space-y-5 text-left shadow-sm">
          <form onSubmit={handleStartResearch} className="space-y-4">
            {/* Topic Input */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 px-0.5">Research Topic / Question</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex. The impact of edge AI model deployment on mobile UX..."
                rows={4}
                className="w-full bg-gray-50 dark:bg-aurqo-darkInput border border-gray-200 dark:border-aurqo-darkBorder rounded-xl px-3.5 py-3 text-xs text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 dark:focus:border-purple-500/35 transition-all resize-none"
                required
              />
            </div>

            {/* Research mode toggles */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5 px-0.5 block">Output Format</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResearchMode('summary')}
                  className={`py-2.5 px-3.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                    researchMode === 'summary'
                      ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                      : 'border-gray-200/50 dark:border-aurqo-darkBorder/40 text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-aurqo-darkInput/40 hover:bg-gray-100 dark:hover:bg-aurqo-darkHover/40'
                  }`}
                >
                  <div className="font-bold">Sources & Summary</div>
                  <div className={`text-[9px] mt-0.5 ${researchMode === 'summary' ? 'text-purple-200' : 'text-gray-400'}`}>Gather key facts</div>
                </button>
                <button
                  type="button"
                  onClick={() => setResearchMode('paper')}
                  className={`py-2.5 px-3.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                    researchMode === 'paper'
                      ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                      : 'border-gray-200/50 dark:border-aurqo-darkBorder/40 text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-aurqo-darkInput/40 hover:bg-gray-100 dark:hover:bg-aurqo-darkHover/40'
                  }`}
                >
                  <div className="font-bold">Research Paper</div>
                  <div className={`text-[9px] mt-0.5 ${researchMode === 'paper' ? 'text-purple-200' : 'text-gray-400'}`}>Complete draft with sources</div>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              {loading ? `${status.charAt(0).toUpperCase() + status.slice(1)}...` : 'Start Research'}
            </button>
          </form>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl p-6 min-h-[400px] flex flex-col justify-between shadow-sm relative">
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {loading && (
              <LoadingState message={status === 'researching' ? 'Analyzing scientific databases...' : 'Structuring publication layout...'} />
            )}

            {status === 'failed' && error && (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-sm animate-in fade-in duration-300">
                <span className="p-3 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Research Interrupted</h4>
                  <p className="text-xs text-red-500 mt-1 leading-relaxed">{error}</p>
                </div>
                <button
                  onClick={handleStartResearch}
                  className="px-4 py-2 bg-gray-100 dark:bg-aurqo-darkInput text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-aurqo-darkHover border border-gray-200 dark:border-aurqo-darkBorder transition-all"
                >
                  Retry Research
                </button>
              </div>
            )}

            {status === 'idle' && !result && (
              <EmptyState
                title="Workspace Empty"
                description="Input a research topic on the left to review facts and generate paper sections."
              />
            )}

            {status === 'completed' && result && (
              <div className="w-full flex flex-col space-y-5 animate-in zoom-in-95 duration-300 text-left max-w-2xl">
                
                {result.content ? (
                  // Full Paper Layout
                  <div className="space-y-4 bg-gray-50 dark:bg-aurqo-darkInput p-5 rounded-2xl border border-gray-200/50 dark:border-aurqo-darkBorder/40 max-h-[380px] overflow-y-auto">
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-aurqo-darkBorder/40 pb-3">
                      <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Draft Completed</span>
                      <span className="text-[9px] text-gray-400 font-mono">{result.createdAt}</span>
                    </div>
                    <pre className="text-xs text-gray-750 dark:text-gray-350 leading-relaxed font-sans whitespace-pre-wrap">
                      {result.content}
                    </pre>
                  </div>
                ) : (
                  // Summary & Sources layout
                  <div className="space-y-5 w-full">
                    {/* Findings list */}
                    <div className="bg-gray-50/50 dark:bg-aurqo-darkInput p-4 rounded-xl border border-gray-200/20 dark:border-aurqo-darkBorder/20">
                      <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">Key Findings Summary</span>
                      <ul className="space-y-2.5">
                        {result.findings.map((f, i) => (
                          <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2 leading-relaxed">
                            <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sources reference */}
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-2.5">Identified References</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.sources.map((s, idx) => (
                          <div key={idx} className="p-3 bg-white dark:bg-aurqo-darkHover/40 border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-xl flex gap-2.5 items-center">
                            <Database className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{s.title}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate">Author: {s.author}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Previous research history */}
          {history.length > 0 && (
            <div className="mt-8 border-t border-gray-100 dark:border-aurqo-darkBorder/20 pt-6 text-left">
              <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-3">Research Archive</span>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {history.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setResult(item.data);
                      setResearchMode(item.mode);
                      setStatus('completed');
                    }}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      result?.id === item.id 
                        ? 'border-purple-600 bg-purple-50/20 text-purple-700 dark:text-purple-400 shadow-sm ring-2 ring-purple-600/10' 
                        : 'border-gray-200/50 dark:border-aurqo-darkBorder/40 text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-aurqo-darkInput/40 hover:bg-gray-100 dark:hover:bg-aurqo-darkHover/40'
                    }`}
                  >
                    {item.topic.length > 20 ? item.topic.substring(0, 20) + '...' : item.topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
