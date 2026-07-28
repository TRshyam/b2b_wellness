import React from 'react';
import { Lightbulb, ShieldCheck } from 'lucide-react';

export default function WeeklyInsights({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="dashboard-card p-6 md:p-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            Weekly Narrative Insights
          </h2>
          <p className="text-helper text-slate-600 dark:text-slate-400">Rule-based physiological summaries derived from 14-day tracking</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex items-start space-x-3"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-body text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
