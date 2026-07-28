import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mockToken, setMockToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Request failed');
      
      setSubmitted(true);
      if (data.reset_token) {
        setMockToken(data.reset_token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-1/4 left-1/4 w-96 h-96 glow-orb-cyan blur-3xl pointer-events-none opacity-40"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 rounded-3xl border border-white/15 shadow-2xl backdrop-blur-2xl">
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>

          <h1 className="text-xl font-bold text-white mb-1">Forgot Password</h1>
          <p className="text-xs text-slate-400 mb-6">Enter your company email to receive reset instructions.</p>

          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-1">Reset Instructions Sent</p>
                  <p>If <span className="font-semibold text-emerald-400">{email}</span> is registered in XYZ System, a reset link has been dispatched.</p>
                </div>
              </div>

              {mockToken && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Development Demo Token</span>
                  <div className="font-mono text-[11px] text-cyan-300 break-all bg-slate-900 p-2 rounded border border-white/5">
                    {mockToken}
                  </div>
                  <button
                    onClick={() => onNavigate(`reset_password?token=${mockToken}`)}
                    className="w-full mt-2 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/30 text-xs"
                  >
                    Proceed to Reset Password Page
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Company Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya.ramesh@xyz.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Password Reset Email'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
