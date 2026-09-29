import React, { useState, useEffect } from 'react';
import { generateVideo } from '../services/videoService';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { Video, Send, RefreshCw, Download, Play, Film } from 'lucide-react';
import { loadUserData, saveUserData } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

export default function VideoPage({ setIsResponding }) {
  const { currentUser } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, queued, processing, completed, failed
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (setIsResponding) {
      setIsResponding(loading);
    }
  }, [loading, setIsResponding]);
  
  // Previous video generations history
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser?.userId) {
      const savedHistory = loadUserData(currentUser.userId, 'videoGenerations', []);
      setHistory(savedHistory);
    }
  }, [currentUser]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError('');
    setResult(null);

    // Simulate ChatGPT-style queuing pipeline
    setStatus('queued');
    
    try {
      // Step 1: Queued for 1s
      await new Promise(r => setTimeout(r, 800));
      setStatus('processing');
      
      // Step 2: Processing for 1.2s
      const generated = await generateVideo(prompt, { aspectRatio: ratio });
      
      setStatus('completed');
      setResult(generated);
      
      const newHistory = [generated, ...history];
      setHistory(newHistory);
      saveUserData(currentUser.userId, 'videoGenerations', newHistory);
    } catch (err) {
      setStatus('failed');
      setError(err.message || 'An error occurred during video compilation.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    handleGenerate();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] dark:bg-aurqo-darkBg p-6 lg:p-8 text-gray-850 dark:text-gray-200 overflow-y-auto">
      <header className="mb-8 text-left">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center gap-2">
          <Video className="w-5 h-5 text-cyan-400" />
          Video Search & Generation
        </h2>
        <p className="text-xs text-gray-400 mt-1">Prompt and create rich, high-definition short motion clips.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Settings */}
        <div className="lg:col-span-5 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl p-6 space-y-5 text-left shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Prompt */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 px-0.5">Describe your video scene</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Cinematic drone shot of misty mountains, soft sunrise lighting, high-definition realism..."
                rows={4}
                className="w-full bg-gray-50 dark:bg-aurqo-darkInput border border-gray-200 dark:border-aurqo-darkBorder rounded-xl px-3.5 py-3 text-xs text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 dark:focus:border-purple-500/35 transition-all resize-none"
                required
              />
            </div>

            {/* Ratio selection */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5 px-0.5 block">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-3">
                {['16:9', '9:16'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRatio(item)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      ratio === item
                        ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                        : 'border-gray-200/50 dark:border-aurqo-darkBorder/40 text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-aurqo-darkInput/40 hover:bg-gray-100 dark:hover:bg-aurqo-darkHover/40'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Film className="w-4 h-4" />
              {loading ? `${status.charAt(0).toUpperCase() + status.slice(1)}...` : 'Create Video'}
            </button>
          </form>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl p-6 min-h-[400px] flex flex-col justify-between shadow-sm relative">
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {loading && (
              <div className="space-y-4">
                <LoadingState message={status === 'queued' ? 'Queued in render queue...' : 'Synthesizing scene frames...'} />
                <div className="w-48 bg-gray-100 dark:bg-aurqo-darkInput rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full bg-purple-600 transition-all duration-[1000ms] ${
                    status === 'queued' ? 'w-1/4' : 'w-3/4'
                  }`} />
                </div>
              </div>
            )}

            {status === 'failed' && error && (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-sm animate-in fade-in duration-300">
                <span className="p-3 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Compilation Failed</h4>
                  <p className="text-xs text-red-500 mt-1 leading-relaxed">{error}</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-gray-100 dark:bg-aurqo-darkInput text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-aurqo-darkHover border border-gray-200 dark:border-aurqo-darkBorder transition-all"
                >
                  Retry Compilation
                </button>
              </div>
            )}

            {status === 'idle' && !result && (
              <EmptyState
                title="Workspace Empty"
                description="Input a scene details on the left to compile rich cinematic video sequences."
              />
            )}

            {status === 'completed' && result && (
              <div className="w-full flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-300">
                <div className="relative max-w-lg w-full rounded-2xl overflow-hidden border border-gray-250 dark:border-aurqo-darkBorder/60 group bg-gray-55/50 dark:bg-aurqo-darkInput">
                  {/* Mock Video Element */}
                  <video
                    src={result.url}
                    controls
                    className="w-full h-auto max-h-[360px]"
                    poster="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=60"
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <a
                      href={result.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-white/90 text-gray-900 hover:bg-purple-600 hover:text-white transition-all shadow-md flex items-center justify-center"
                      title="Download clip"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="text-left w-full max-w-md">
                  <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">Prompt Details</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mt-1">{result.prompt}</p>
                </div>
              </div>
            )}
          </div>

          {/* Previous Generations list */}
          {history.length > 0 && (
            <div className="mt-8 border-t border-gray-100 dark:border-aurqo-darkBorder/20 pt-6 text-left">
              <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-3">Generation Archive</span>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setResult(item);
                      setStatus('completed');
                    }}
                    className={`aspect-video rounded-lg border bg-gray-900/10 cursor-pointer hover:scale-105 transition-all flex items-center justify-center overflow-hidden relative group ${
                      result?.id === item.id 
                        ? 'border-purple-600 shadow-md ring-2 ring-purple-600/20' 
                        : 'border-gray-200/50 dark:border-aurqo-darkBorder/40'
                    }`}
                  >
                    <Play className="w-4 h-4 text-purple-600 dark:text-purple-400 z-10 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
