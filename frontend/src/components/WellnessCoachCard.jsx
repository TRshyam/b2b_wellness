import React from 'react';
import { Bot, Sparkles, Shield } from 'lucide-react';

export default function WellnessCoachCard({ persona, insights, user }) {
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Priya';

  return (
    <div className="accent-glass p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-cyan-950/20 text-white">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20 shrink-0">
          <Bot className="w-6 h-6 stroke-[2.5]" />
        </div>

        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-card-title text-white font-extrabold flex items-center gap-2">
              Aura AI Assistant
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Rule-Based Intelligence
            </span>
          </div>

          <p className="text-body text-slate-200 leading-relaxed">
            "Hello {firstName}! Based on your recent 14-day physiological trends, your active profile is <span className="text-cyan-300 font-bold">{persona?.name || 'Balanced Performer'}</span>. {persona?.description || 'You are maintaining optimal rest and hydration compliance across key corporate benchmarks.'}"
          </p>

          {insights && insights.length > 0 && (
            <div className="pt-2 flex items-center gap-2 text-helper text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Key Insight: {insights[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
