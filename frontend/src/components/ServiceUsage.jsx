import React from 'react';
import { Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ServiceUsage({ usageData }) {
  if (!usageData || !usageData.category_summaries) return null;

  const { category_summaries, total_sessions_90d, zero_usage_categories } = usageData;

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'massage': return 'bg-purple-500';
      case 'sauna': return 'bg-amber-500';
      case 'thermal_spa': return 'bg-cyan-500';
      case 'nutrition': return 'bg-emerald-500';
      case 'yoga': return 'bg-indigo-500';
      default: return 'bg-teal-500';
    }
  };

  return (
    <div className="dashboard-card p-6 md:p-8 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            My Service Usage Summary
          </h2>
          <p className="text-helper text-slate-600 dark:text-slate-400">Cumulative benefit engagement across all 9 wellness categories (90-Day Window)</p>
        </div>
        <span className="text-helper font-bold px-3 py-1 rounded-xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
          {total_sessions_90d} Total Sessions Logged
        </span>
      </div>

      {/* Category Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {category_summaries.map((cat, index) => {
          const percentage = Math.min((cat.session_count / 10) * 100, 100);
          return (
            <div key={index} className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 space-y-2 card-elevation-1">
              <div className="flex items-center justify-between">
                <span className="text-card-title text-slate-900 dark:text-white capitalize">
                  {cat.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {cat.session_count} visits
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getCategoryColor(cat.category)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>90-Day Activity</span>
                <span>{cat.session_count === 0 ? 'Zero Usage' : 'Active'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero Usage Blindspot Warning */}
      {zero_usage_categories && zero_usage_categories.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-800 dark:text-amber-300 font-medium">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-900 dark:text-amber-200 mb-0.5">Unutilized Corporate Benefits Identified:</span>
            You have zero recorded sessions in <span className="font-bold underline">{zero_usage_categories.map(c => c.replace('_', ' ')).join(', ')}</span> over the past 90 days. Check your recommended interventions to activate these covered benefits.
          </div>
        </div>
      )}
    </div>
  );
}
