import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/imageService';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { Image as ImageIcon, Send, RefreshCw, Download, Sparkles } from 'lucide-react';
import { loadUserData, saveUserData } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

export default function ImagePage({ setIsResponding }) {
  const { currentUser } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('1:1');
  const [style, setStyle] = useState('Photorealistic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (setIsResponding) {
      setIsResponding(loading);
    }
  }, [loading, setIsResponding]);
  
  // Previous generations lists
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser?.userId) {
      const savedHistory = loadUserData(currentUser.userId, 'imageGenerations', []);
      setHistory(savedHistory);
    }
  }, [currentUser]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const options = { style, dimensions: aspect === '1:1' ? '1024x1024' : aspect === '16:9' ? '1920x1080' : '1080x1920' };
      const generated = await generateImage(prompt, options);
      
      setResult(generated);
      
      const newHistory = [generated, ...history];
      setHistory(newHistory);
      saveUserData(currentUser.userId, 'imageGenerations', newHistory);
    } catch (err) {
      setError(err.message || 'An error occurred during image generation.');
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
          <ImageIcon className="w-5 h-5 text-cyan-400" />
          Image Search & Creation
        </h2>
        <p className="text-xs text-gray-400 mt-1">Prompt and create dynamic illustrations or edit graphical elements.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs & Settings */}
        <div className="lg:col-span-5 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl p-6 space-y-5 text-left shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Prompt */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 px-0.5">Describe your image</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city in the clouds, cyberpunk details, neon lights..."
                rows={4}
                className="w-full bg-gray-50 dark:bg-aurqo-darkInput border border-gray-200 dark:border-aurqo-darkBorder rounded-xl px-3.5 py-3 text-xs text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 dark:focus:border-purple-500/35 transition-all resize-none"
                required
              />
            </div>

            {/* Styling Style */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 px-0.5">Art Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-aurqo-darkInput border border-gray-200 dark:border-aurqo-darkBorder rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 dark:focus:border-purple-500/35 transition-all"
              >
                <option>Photorealistic</option>
                <option>Digital Art</option>
                <option>Anime</option>
                <option>Cyberpunk</option>
                <option>Oil Painting</option>
              </select>
            </div>

            {/* Aspect ratio options */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5 px-0.5 block">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {['1:1', '16:9', '9:16'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspect(ratio)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      aspect === ratio
                        ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                        : 'border-gray-200/50 dark:border-aurqo-darkBorder/40 text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-aurqo-darkInput/40 hover:bg-gray-100 dark:hover:bg-aurqo-darkHover/40'
                    }`}
                  >
                    {ratio}
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
              <Sparkles className="w-4 h-4 animate-pulse" />
              {loading ? 'Synthesizing image...' : 'Generate Image'}
            </button>
          </form>
        </div>

        {/* Right Output: Generation Board */}
        <div className="lg:col-span-7 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl p-6 min-h-[400px] flex flex-col justify-between shadow-sm relative">
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {loading && (
              <LoadingState message="Synthesizing pixels..." />
            )}

            {error && (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-sm animate-in fade-in duration-300">
                <span className="p-3 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Generation Failed</h4>
                  <p className="text-xs text-red-500 mt-1 leading-relaxed">{error}</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-gray-100 dark:bg-aurqo-darkInput text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-aurqo-darkHover border border-gray-200 dark:border-aurqo-darkBorder transition-all"
                >
                  Retry Generation
                </button>
              </div>
            )}

            {!loading && !error && !result && (
              <EmptyState
                title="Workspace Empty"
                description="Input a descriptive prompt on the left to synthesize high-quality images."
              />
            )}

            {!loading && !error && result && (
              <div className="w-full flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-300">
                <div className="relative max-w-md w-full rounded-2xl overflow-hidden border border-gray-250 dark:border-aurqo-darkBorder/60 group bg-gray-50/50 dark:bg-aurqo-darkInput">
                  <img
                    src={result.url}
                    alt={result.prompt}
                    className="w-full h-auto object-cover max-h-[360px]"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white text-gray-900 hover:bg-purple-100 hover:text-purple-600 transition-all shadow-md transform translate-y-2 group-hover:translate-y-0 duration-300"
                      title="Download image"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <div className="text-left w-full max-w-md">
                  <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">Prompt Used</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mt-1">{result.prompt}</p>
                </div>
              </div>
            )}
          </div>

          {/* Previous generations list */}
          {history.length > 0 && (
            <div className="mt-8 border-t border-gray-100 dark:border-aurqo-darkBorder/20 pt-6 text-left">
              <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-3">Previous Generations</span>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setResult(item)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border cursor-pointer hover:scale-105 transition-all ${
                      result?.id === item.id 
                        ? 'border-purple-600 shadow-md ring-2 ring-purple-600/20' 
                        : 'border-gray-200/50 dark:border-aurqo-darkBorder/40'
                    }`}
                  >
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
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
