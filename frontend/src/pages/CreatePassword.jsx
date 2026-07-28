import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

export default function CreatePassword({ onNavigate }) {
  const { firstTimeUser, createPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!firstTimeUser) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 text-white">
        <div className="text-center glass-panel p-8 rounded-2xl">
          <p className="mb-4">No first-time user session active.</p>
          <button onClick={() => onNavigate('login')} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPassword(firstTimeUser.employee_id, password);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Failed to set password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-1/4 left-1/4 w-96 h-96 glow-orb-emerald blur-3xl pointer-events-none opacity-40"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 glow-orb-cyan blur-3xl pointer-events-none opacity-40"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 rounded-3xl border border-white/15 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-xl mb-3">
              <ShieldCheck className="w-8 h-8 text-slate-950 stroke-[2.5]" />
            </div>
            <h1 className="text-xl font-bold text-white">First-Time Account Setup</h1>
            <p className="text-xs text-slate-400 mt-1">
              Welcome <span className="text-emerald-400 font-semibold">{firstTimeUser.full_name}</span> ({firstTimeUser.email})! Please create your account password.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Create Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Check className={`w-3.5 h-3.5 ${password.length >= 6 ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>At least 6 characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className={`w-3.5 h-3.5 ${password && password === confirmPassword ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>Passwords match</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
            >
              {isSubmitting ? 'Activating Account...' : 'Set Password & Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
