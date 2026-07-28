import React from 'react';
import { Sparkles, ArrowRight, Lightbulb, HeartPulse } from 'lucide-react';

export default function HeroRecommendation({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  const topRec = recommendations[0];
  const secondaryRec = recommendations.length > 1 ? recommendations[1] : null;

  const getCategoryBenefit = (rule_id) => {
    switch (rule_id) {
      case 'THERMAL_SPA_SAUNA': return '+1.2 hrs Sleep & Stress Relief';
      case 'SLEEP_COACHING': return 'Circadian Rhythm & Recovery Optimization';
      case 'HYDRATION_CONSULT': return 'Metabolic Energy & Hydration Balance';
      case 'MOOD_MINDFULNESS': return 'Cortisol & Stress Stabilization';
      case 'FITNESS_YOGA': return '+25% Active Vitality & Energy';
      default: return 'Optimal Health Recovery';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Recommended For You
        </h2>
        <span className="text-helper text-slate-600 dark:text-slate-400">
          Personalized Corporate Intervention
        </span>
      </div>

      {/* Hero Recommendation Card */}
      <div className="accent-glass p-6 md:p-8 rounded-3xl relative overflow-hidden border border-emerald-500/30 shadow-md dark:shadow-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:from-slate-900/90 dark:via-slate-900/80 dark:to-emerald-950/20 text-slate-900 dark:text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                Priority #{topRec.priority} Intervention
              </span>
              <span className="text-helper text-slate-600 dark:text-slate-300 font-medium capitalize">
                {topRec.category.replace('_', ' ')}
              </span>
            </div>

            <h3 className="text-card-title md:text-2xl font-extrabold text-slate-900 dark:text-white">
              {topRec.action}
            </h3>

            <p className="text-body text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Why we're recommending this: </span>
              "{topRec.justification}"
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 text-helper font-semibold text-cyan-800 dark:text-cyan-300 bg-cyan-500/15 px-3.5 py-1.5 rounded-xl border border-cyan-500/30">
                <HeartPulse className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Est. Health Benefit: {getCategoryBenefit(topRec.rule_id)}</span>
              </div>
            </div>
          </div>

          <div className="lg:w-72 shrink-0 flex flex-col justify-center space-y-3">
            <button className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-400 dark:hover:from-emerald-400 dark:hover:to-teal-300 text-white dark:text-slate-950 font-extrabold text-body transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 group">
              <span>Book Recommended Session</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs text-center text-slate-600 dark:text-slate-300 block font-medium">
              100% Covered under XYZ Wellness Benefits
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Recommendation */}
      {secondaryRec && (
        <div className="mt-4 p-4 rounded-2xl dashboard-card flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Priority #{secondaryRec.priority}</span>
                <span className="text-body font-bold text-slate-900 dark:text-white">{secondaryRec.action}</span>
              </div>
              <p className="text-helper text-slate-600 dark:text-slate-400 truncate max-w-xl">{secondaryRec.justification}</p>
            </div>
          </div>
          <button className="py-2 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-helper font-semibold border border-slate-200 dark:border-white/10 transition-colors shrink-0">
            View Details
          </button>
        </div>
      )}
    </div>
  );
}
