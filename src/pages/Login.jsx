import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loginUser } from '../services/authService';
import AuroqLogo from '../components/AuroqLogo';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Sun, Moon, 
  MessageSquare, Image, Video, FileText, File, AudioLines 
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState('demo@aurqo.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      login(user.userId, user.name, user.email);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoUser = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    alert(`Selected demo profile: ${demoEmail === 'demo@aurqo.com' ? 'Maha Lakshmi (Plus)' : 'John Doe (Free)'}. Click "Sign In" to proceed.`);
  };

  return (
    <div className="min-h-screen w-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#090a0f] text-gray-800 dark:text-gray-100 transition-colors duration-200 overflow-y-auto">
      
      {/* Left Column: Visual/Marketing Branding (Desktop Only) */}
      <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#05060a] to-[#0c0d12] text-white relative overflow-hidden border-r border-aurqo-darkBorder/40">
        {/* Subtle Ambient Cosmic Background Glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-blue-500/10 blur-[100px]" />

        {/* Brand Logo */}
        <div className="flex items-center z-10">
          <AuroqLogo isResponding={false} />
        </div>

        {/* Floating Orb Graphic Presentation */}
        <div className="flex-1 flex items-center justify-center z-10 py-8">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Center Glowing Card */}
            <div className="w-32 h-44 bg-gradient-to-b from-[#1c1f33]/90 to-[#0f111a]/95 border border-purple-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.25)] relative z-10">
              <div className="absolute inset-0 bg-purple-500/10 rounded-2xl blur-md" />
              <svg viewBox="0 0 100 100" className="w-14 h-14 text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.7)] fill-current">
                <path d="M 50 10 Q 50 50 10 50 Q 50 50 50 90 Q 50 50 90 50 Q 50 50 50 10 Z" />
              </svg>
            </div>

            {/* Orbiting Hexagonal Buttons */}
            {/* 1. AI Chat */}
            <div className="absolute top-[-30px] flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1">AI Chat</span>
            </div>

            {/* 2. Text Gen */}
            <div className="absolute top-[25px] right-[10px] flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1">Text Gen</span>
            </div>

            {/* 3. Docs */}
            <div className="absolute bottom-[25px] right-[10px] flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                <File className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1">Docs</span>
            </div>

            {/* 4. Audio Gen */}
            <div className="absolute bottom-[-30px] flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                <AudioLines className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1">Audio Gen</span>
            </div>

            {/* 5. Video Gen */}
            <div className="absolute bottom-[25px] left-[10px] flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-md">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1">Video Gen</span>
            </div>

            {/* 6. Image Gen */}
            <div className="absolute top-[25px] left-[10px] flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
                <Image className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1">Image Gen</span>
            </div>
          </div>
        </div>

        {/* Text Greeting Card & Quotes */}
        <div className="text-left space-y-4 z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome to <br/>
            the future of <span className="gradient-text dark:gradient-text-alt">AI</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            An intelligent platform. Build, automate, and achieve more with Tamili.
          </p>
          <div className="pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 italic">
              "The best way to predict the future is to create it."
            </p>
            <p className="text-[10px] text-blue-400 font-bold mt-1">
              — with Tamili
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Card Panel */}
      <div className="lg:col-span-7 flex flex-col justify-between p-8 lg:p-12 relative bg-white dark:bg-[#090a0f]">
        {/* Light/Dark mode switcher */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-full border border-gray-200 dark:border-aurqo-darkBorder/40 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover text-gray-500 dark:text-gray-400 transition-colors shadow-sm"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Centered Form */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto space-y-8 py-12">
          {/* Header */}
          <div className="text-left space-y-2">
            {/* Logo on Mobile (Hidden on Desktop) */}
            <div className="flex lg:hidden mb-6">
              <AuroqLogo isResponding={false} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to <span className="text-blue-600 dark:text-blue-400">your account</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Continue your journey with Tamili
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-left">
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="flex flex-col text-left">
              <label className="text-xs font-bold text-gray-700 dark:text-zinc-400 mb-1.5 px-0.5">Email address</label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-[50%] translate-y-[-50%]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-aurqo-darkInput border border-gray-205 dark:border-aurqo-darkBorder rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 dark:focus:border-purple-500/35 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col text-left">
              <label className="text-xs font-bold text-gray-700 dark:text-zinc-400 mb-1.5 px-0.5">Password</label>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-[50%] translate-y-[-50%]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-aurqo-darkInput border border-gray-205 dark:border-aurqo-darkBorder rounded-xl pl-11 pr-11 py-3 text-sm text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 dark:focus:border-purple-500/35 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 absolute right-4 top-[50%] translate-y-[-50%] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 dark:border-aurqo-darkBorder dark:bg-aurqo-darkInput text-purple-600 focus:ring-purple-500"
                />
                <span>Remember me</span>
              </label>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert("Reset password instructions sent to your email!"); }} 
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Logins/Demo selectors */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-aurqo-darkBorder/40">
            <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block text-left">
              or continue with (Demo Profiles)
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => selectDemoUser('demo@aurqo.com')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 dark:border-aurqo-darkBorder/40 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover text-[11px] font-bold transition-all text-gray-600 dark:text-gray-300"
              >
                <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.7 0 3.2.6 4.3 1.7l3.15-3.15C19.07 1.42 15.82 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.89 11.57-11.79 0-.78-.07-1.4-.24-2.11H12.24z" />
                </svg>
                <span>Google</span>
              </button>
              
              <button
                type="button"
                onClick={() => selectDemoUser('demo@aurqo.com')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 dark:border-aurqo-darkBorder/40 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover text-[11px] font-bold transition-all text-gray-600 dark:text-gray-300"
              >
                <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                  <path d="M11.4 0H0v11.4h11.4V0zm12.6 0H12.6v11.4H24V0zM11.4 12.6H0V24h11.4V12.6zm12.6 0H12.6V24H24V12.6z" />
                </svg>
                <span>Microsoft</span>
              </button>

              <button
                type="button"
                onClick={() => selectDemoUser('john.doe@aurqo.com')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 dark:border-aurqo-darkBorder/40 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover text-[11px] font-bold transition-all text-gray-600 dark:text-gray-300"
              >
                <svg className="w-4 h-4 text-gray-900 dark:text-white fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.73-1.2 1.87-1.05 2.97 1.1.09 2.24-.54 3-1.41z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <span>Don't have an account? </span>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); alert("Registration is currently restricted to demo profiles."); }} 
            className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
