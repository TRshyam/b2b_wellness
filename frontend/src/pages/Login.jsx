import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, Sun, Moon, Laptop } from 'lucide-react';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [email, setEmail] = useState('priya.ramesh@xyz.com');
  const [password, setPassword] = useState('Password123!');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError('System error authenticating with server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden transition-colors">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Theme Switcher (Top Right) */}
      <div className="absolute top-6 right-6 flex items-center space-x-2">
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

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
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

          {/* Footer Preset Credentials */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-center space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Demo Scenario Logins:</span>
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
