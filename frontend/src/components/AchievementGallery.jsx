import React from 'react';
import { Award, Moon, Droplets, Utensils, CheckCircle, Lock } from 'lucide-react';

export default function AchievementGallery({ achievements }) {
  if (!achievements || achievements.length === 0) return null;

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'Moon': return Moon;
      case 'Droplets': return Droplets;
      case 'Utensils': return Utensils;
      default: return Award;
    }
  };

  return (
    <div className="dashboard-card p-6 md:p-8 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            Achievement Gallery
          </h2>
          <p className="text-helper text-slate-600 dark:text-slate-400">Earned wellness streaks & goal completion badges</p>
        </div>
        <span className="text-helper font-bold px-3 py-1 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
          {achievements.filter(a => a.earned).length} / {achievements.length} Badges Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((badge) => {
          const Icon = getBadgeIcon(badge.icon);
          return (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all ${
                badge.earned
                  ? 'bg-amber-500/5 dark:bg-slate-900/90 border-amber-500/30 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${
                  badge.earned
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-white/5'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {badge.earned ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-white/10 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>

              <h3 className="text-card-title text-slate-900 dark:text-white mb-1">{badge.title}</h3>
              <p className="text-helper text-slate-600 dark:text-slate-400 mb-3">{badge.requirement}</p>
              
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Progress</span>
                <span className={badge.earned ? 'text-amber-700 dark:text-amber-300' : 'text-slate-400'}>{badge.progress}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
