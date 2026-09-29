import React, { useState, useEffect } from 'react';
import { generateAudio } from '../services/audioService';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { Volume2, Play, RefreshCw, Download, Music, AudioLines } from 'lucide-react';
import { loadUserData, saveUserData } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

export default function AudioPage({ setIsResponding }) {
  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState('');
  const [voice, setVoice] = useState('Male (Deep)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (setIsResponding) {
      setIsResponding(loading);
    }
  }, [loading, setIsResponding]);
  
  // Previous generations history
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser?.userId) {
      const savedHistory = loadUserData(currentUser.userId, 'audioGenerations', []);
      setHistory(savedHistory);
    }
  }, [currentUser]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const options = { voice };
      const generated = await generateAudio(inputText, options);
      
      setResult(generated);
      
      const newHistory = [generated, ...history];
      setHistory(newHistory);
      saveUserData(currentUser.userId, 'audioGenerations', newHistory);
    } catch (err) {
      setError(err.message || 'An error occurred during audio synthesis.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    handleGenerate();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] dark:bg-aurqo-darkBg p-6 lg:p-8 text-gray-855 dark:text-gray-200 overflow-y-auto">
      <header className="mb-8 text-left">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-cyan-400" />
          Audio Search & Synthesis
        </h2>
        <p className="text-xs text-gray-400 mt-1">Create synthetic voices, tracks, text-to-speech outputs, or edit audio files.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs & Settings */}
        <div className="lg:col-span-5 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl p-6 space-y-5 text-left shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Input Text */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 px-0.5">Text to Synthesize</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter the speech content or description for the audio clip..."
                rows={4}
                className="w-full bg-gray-50 dark:bg-aurqo-darkInput border border-gray-200 dark:border-aurqo-darkBorder rounded-xl px-3.5 py-3 text-xs text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 dark:focus:border-purple-500/35 transition-all resize-none"
                required
              />
            </div>

            {/* Voice Model option */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 px-0.5">Voice Model</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-gray-50 dark:bg-aurqo-darkInput border border-gray-200 dark:border-aurqo-darkBorder rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 dark:focus:border-purple-500/35 transition-all"
              >
                <option>Male (Deep)</option>
                <option>Female (Crisp)</option>
                <option>Narrator (Professional)</option>
                <option>Robotic (Sci-Fi)</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <AudioLines className="w-4 h-4 animate-pulse" />
              {loading ? 'Synthesizing voice...' : 'Generate Audio'}
            </button>
          </form>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 bg-white dark:bg-aurqo-darkCard border border-gray-200/50 dark:border-aurqo-darkBorder/40 rounded-2xl p-6 min-h-[400px] flex flex-col justify-between shadow-sm relative">
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {loading && (
              <LoadingState message="Synthesizing audio frequencies..." />
            )}

            {error && (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-sm animate-in fade-in duration-300">
                <span className="p-3 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Synthesis Failed</h4>
                  <p className="text-xs text-red-500 mt-1 leading-relaxed">{error}</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-gray-100 dark:bg-aurqo-darkInput text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-aurqo-darkHover border border-gray-200 dark:border-aurqo-darkBorder transition-all"
                >
                  Retry Synthesis
                </button>
              </div>
            )}

            {!loading && !error && !result && (
              <EmptyState
                title="Workspace Empty"
                description="Input your voice prompt on the left to synthesize text-to-speech audio outputs."
              />
            )}

            {!loading && !error && result && (
              <div className="w-full flex flex-col items-center space-y-5 animate-in zoom-in-95 duration-300 max-w-md">
                
                {/* Audio Wave Visual Mock */}
                <div className="w-full h-24 bg-gray-50 dark:bg-aurqo-darkInput rounded-2xl border border-gray-200/50 dark:border-aurqo-darkBorder/40 flex items-center justify-center px-6 relative overflow-hidden">
                  <div className="flex items-center gap-[3px] w-full justify-center h-12">
                    {[...Array(24)].map((_, i) => (
                      <span 
                        key={i} 
                        className="w-1 bg-purple-500 rounded-full transition-all animate-pulse" 
                        style={{ 
                          height: `${Math.floor(Math.random() * 85) + 15}%`,
                          animationDelay: `${i * 40}ms`,
                          animationDuration: '600ms'
                        }} 
                      />
                    ))}
                  </div>
                </div>

                {/* HTML Audio Player */}
                <div className="w-full flex items-center gap-4 bg-gray-50 dark:bg-aurqo-darkInput p-3 rounded-2xl border border-gray-200/30 dark:border-aurqo-darkBorder/30">
                  <audio
                    src={result.url}
                    controls
                    className="w-full accent-purple-600 outline-none text-xs"
                  />
                  <a
                    href={result.url}
                    download
                    className="p-2 bg-white dark:bg-aurqo-darkHover text-gray-700 dark:text-gray-300 rounded-xl shadow border border-gray-200/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    title="Download audio"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>

                <div className="text-left w-full">
                  <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">Input Transcript</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mt-1">{result.input}</p>
                </div>
              </div>
            )}
          </div>

          {/* Previous Generations history */}
          {history.length > 0 && (
            <div className="mt-8 border-t border-gray-100 dark:border-aurqo-darkBorder/20 pt-6 text-left">
              <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-3">Audio Library</span>
              <div className="flex flex-col gap-2">
                {history.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setResult(item)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      result?.id === item.id 
                        ? 'border-purple-600 bg-purple-50/20 dark:bg-purple-950/10' 
                        : 'border-gray-200/50 dark:border-aurqo-darkBorder/40 hover:bg-gray-100/50 dark:hover:bg-aurqo-darkHover/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Volume2 className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 truncate font-semibold">
                        {item.input}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">{item.duration}</span>
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
