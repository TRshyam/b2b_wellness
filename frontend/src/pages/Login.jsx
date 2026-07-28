import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { VERCEL_DOMAIN_URL, LOCAL_BACKEND_URL, getApiBaseUrl, setApiBaseUrl } from '../config/api';
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight, Sun, Moon, Server } from 'lucide-react';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [email, setEmail] = useState('priya.ramesh@xyz.com');
  const [password, setPassword] = useState('Password123!');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [corsNotice, setCorsNotice] = useState(false);
  const [activeUrl, setActiveUrl] = useState(getApiBaseUrl());

  const handleToggleBackend = (targetUrl) => {
    setApiBaseUrl(targetUrl);
    setActiveUrl(targetUrl);
    setError(null);
    setCorsNotice(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCorsNotice(false);

    try {
      const res = await login(email, password);
      if (!res.success) {
        if (res.isCorsPreflightBlocked || res.isVercelProtected || res.is404Error) {
          setCorsNotice(true);
          setError(res.message || 'API connection error or 404 Not Found connecting to backend.');
        } else {
          setError(res.error || 'Authentication failed. Please check credentials.');
        }
      }
    } catch (err) {
      setCorsNotice(true);
      setError('CORS Preflight or Network connection error to backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden transition-colors">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Controls: Backend Server Toggle & Theme Switcher */}
      <div className="absolute top-6 right-6 flex items-center space-x-3">
        {/* Backend Target Selector */}
        <div className="flex items-center p-1 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-semibold shadow-sm">
          <button
            onClick={() => handleToggleBackend(VERCEL_DOMAIN_URL)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeUrl === VERCEL_DOMAIN_URL || activeUrl === '/api'
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Vercel API (/api)
          </button>
          <button
            onClick={() => handleToggleBackend(LOCAL_BACKEND_URL)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeUrl === LOCAL_BACKEND_URL
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Local Server
          </button>
        </div>

        {/* Theme Button */}
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-sm"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-500" />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="accent-glass p-8 rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 items-center justify-center shadow-lg shadow-emerald-500/20 mb-2">
              <Sparkles className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <h1 className="text-section-title text-slate-900 dark:text-white font-black">
              XYZ Aura Enterprise Portal
            </h1>
            <p className="text-helper text-slate-600 dark:text-slate-400 font-medium">
              Corporate Employee Single Sign-On
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs space-y-2">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span className="font-bold">{error}</span>
              </div>

              {corsNotice && (
                <div className="pt-2 border-t border-rose-500/20 text-[11px] space-y-2 text-slate-700 dark:text-slate-300">
                  <p>
                    <strong>Recommended Action:</strong> Switch to <strong>Local Server</strong> or verify your Vercel deployment has <strong>Vercel Authentication</strong> disabled under Project Settings.
                  </p>
                  <button
                    onClick={() => handleToggleBackend(LOCAL_BACKEND_URL)}
                    className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Server className="w-3.5 h-3.5" /> Switch to Local Server (localhost:8000)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@xyz.com"
                  className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Account Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-slate-600 dark:text-slate-400 font-medium">Remember Device</span>
              </label>

              <button
                type="button"
                onClick={() => onNavigate('forgot_password')}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Target API Indicator & Preset Credentials */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-center space-y-1">
            <span className="text-[11px] text-slate-500 block truncate">Active API Target: {activeUrl}</span>
            <div className="flex justify-center gap-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <button
                onClick={() => { setEmail('priya.ramesh@xyz.com'); setPassword('Password123!'); }}
                className="hover:underline"
              >
                Priya Ramesh (E023)
              </button>
              <span>•</span>
              <button
                onClick={() => { setEmail('sarah.jenkins@xyz.com'); setPassword('Password123!'); }}
                className="hover:underline"
              >
                Sarah Jenkins (EMP-014)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
