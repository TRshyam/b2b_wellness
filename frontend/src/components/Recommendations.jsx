import React from 'react';
import { Compass, Lightbulb, ArrowRight, ShieldCheck, Sparkles, HeartPulse } from 'lucide-react';

export default function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  const getCategoryBenefit = (rule_id) => {
    switch (rule_id) {
      case 'THERMAL_SPA_SAUNA':
        return '+1.2 hrs Sleep & Stress Relief';
      case 'SLEEP_COACHING':
        return 'Circadian Rhythm Restoration';
      case 'HYDRATION_CONSULT':
        return 'Metabolic Energy & Hydration Target';
      case 'MOOD_MINDFULNESS':
        return 'Cortisol & Stress Stabilization';
      case 'FITNESS_YOGA':
        return '+25% Active Energy Expenditure';
      default:
        return 'Optimal Health Recovery';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Recommended For You
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Rule Engine Priority
            </span>
          </h2>
          <p className="text-xs text-slate-400">Targeted corporate wellness interventions based on identified physiological gaps</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((rec, index) => (
          <div
            key={rec.rule_id || index}
            className="glass-panel p-6 rounded-3xl glass-card-interactive relative overflow-hidden border border-emerald-500/25 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-emerald-950/20 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 glow-orb-emerald rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Priority #{rec.priority}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold capitalize">
                    {rec.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  <Lightbulb className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-base font-extrabold text-white mb-2">{rec.action}</h3>

              <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-white/10 mb-4">
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  <span className="font-bold text-emerald-400">Why we're recommending this: </span>
                  "{rec.justification}"
                </p>
              </div>
            </div>

            <div>
              {/* Estimated Benefit Chip */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20 mb-4">
                <HeartPulse className="w-4 h-4 text-cyan-400" />
                <span>Est. Health Impact: {getCategoryBenefit(rec.rule_id)}</span>
              </div>

              {/* Primary Action Button */}
              <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 group">
                <span>Book Recommended Session</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
