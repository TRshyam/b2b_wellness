import React from 'react';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export default function WellnessScoreCard({ score, category, forecast, persona }) {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Excellent': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'Healthy': return 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30';
      case 'Moderate': return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
      default: return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
    }
  };

  const getScoreGradient = (val) => {
    if (val >= 90) return 'from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300';
    if (val >= 75) return 'from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-300';
    if (val >= 60) return 'from-amber-600 to-yellow-500 dark:from-amber-400 dark:to-yellow-300';
    return 'from-rose-600 to-amber-500 dark:from-rose-400 dark:to-amber-300';
  };

  return (
    <div className="dashboard-card p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Score Ring & Gauge */}
        <div className="flex items-center space-x-6">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Radial Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 dark:text-emerald-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${score || 75}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-3xl font-black bg-gradient-to-r ${getScoreGradient(score)} bg-clip-text text-transparent`}>
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-section-title text-slate-900 dark:text-white">Overall Wellness Score</span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${getCategoryColor(category)}`}>
                {category}
              </span>
            </div>
            <p className="text-helper text-slate-600 dark:text-slate-400">
              Composite index based on 14-day sleep, hydration, mood, nutrition, exercise & stress.
            </p>
            {persona && (
              <div className="pt-1 flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span>Persona: {persona.name} — "{persona.tagline}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Wellness Forecast Potential Indicator */}
        {forecast && forecast.potential_gain > 0 && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between shrink-0 md:w-64">
            <div className="flex items-center justify-between text-helper mb-1">
              <span className="text-slate-600 dark:text-slate-400 font-medium">30-Day Score Forecast</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +{forecast.potential_gain} pts
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{forecast.forecast_score}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">potential index</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Achievable by completing active recommendations below.
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
