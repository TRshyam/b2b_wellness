import React from 'react';
import { Moon, Droplets, Utensils, Smile, TrendingDown, TrendingUp, Minus, AlertTriangle, CheckCircle } from 'lucide-react';

export default function UnifiedWellnessPanel({ snapshot }) {
  if (!snapshot) return null;

  const {
    avg_sleep_hours,
    sleep_trend,
    healthy_food_logged_days,
    total_days_logged,
    avg_hydration_glasses,
    avg_hydration_oz,
    avg_mood_score,
    mood_trend,
    mood_trend_description
  } = snapshot;

  const sleepPercentageDelta = avg_sleep_hours < 6.0 ? '-12%' : '+8%';
  const foodPercentage = Math.round((healthy_food_logged_days / total_days_logged) * 100);

  const getMoodTrendIcon = () => {
    if (mood_trend === 'Declining') return <TrendingDown className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />;
    if (mood_trend === 'Improving') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
            Wellness Overview
            <span className="text-helper font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10">
              14-Day Rolling Window
            </span>
          </h2>
          <p className="text-helper text-slate-600 dark:text-slate-400">Unified physiological & emotional health summary</p>
        </div>
      </div>

      {/* Unified Panel Container */}
      <div className="dashboard-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
        
        {/* 1. Sleep Metrics */}
        <div className="pt-4 md:pt-0 md:pr-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-helper font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">Sleep Quality</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Moon className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{avg_sleep_hours}</span>
              <span className="text-helper text-slate-500 dark:text-slate-400 font-medium">hrs / night</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                avg_sleep_hours < 6.0 ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              }`}>
                {avg_sleep_hours < 6.0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {sleepPercentageDelta}
              </span>
              <span className="text-helper text-slate-500 dark:text-slate-400">vs last week</span>
            </div>
          </div>

          <p className="text-helper text-slate-600 dark:text-slate-400 line-clamp-1">{sleep_trend}</p>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                avg_sleep_hours < 6.0 ? 'bg-rose-500 dark:bg-rose-400' : 'bg-purple-500 dark:bg-purple-400'
              }`}
              style={{ width: `${Math.min((avg_sleep_hours / 8.0) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 2. Hydration Intake */}
        <div className="pt-4 md:pt-0 md:px-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-helper font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">Hydration Intake</span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Droplets className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{avg_hydration_glasses}</span>
              <span className="text-helper text-slate-500 dark:text-slate-400 font-medium">glasses / day</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                avg_hydration_glasses < 6.0 ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              }`}>
                {avg_hydration_glasses < 6.0 ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                {avg_hydration_glasses < 6.0 ? 'Below Target' : 'Optimal'}
              </span>
              <span className="text-helper text-slate-500 dark:text-slate-400">({avg_hydration_oz} oz/day)</span>
            </div>
          </div>

          <p className="text-helper text-slate-600 dark:text-slate-400">Target: 8.0 glasses/day (64 oz)</p>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 dark:bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((avg_hydration_glasses / 8.0) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 3. Emotional Vitality */}
        <div className="pt-4 md:pt-0 md:px-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-helper font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Emotional Vitality</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Smile className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{avg_mood_score}</span>
              <span className="text-helper text-slate-500 dark:text-slate-400 font-medium">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                {getMoodTrendIcon()}
                <span>{mood_trend}</span>
              </span>
            </div>
          </div>

          <p className="text-helper text-slate-600 dark:text-slate-400 line-clamp-1">{mood_trend_description}</p>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 dark:bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(avg_mood_score / 5.0) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 4. Healthy Food Compliance */}
        <div className="pt-4 md:pt-0 md:pl-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-helper font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Healthy Nutrition</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Utensils className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{foodPercentage}%</span>
              <span className="text-helper text-slate-500 dark:text-slate-400 font-medium">compliance</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-helper text-slate-600 dark:text-slate-400 font-medium">
                {healthy_food_logged_days} of {total_days_logged} days logged healthy
              </span>
            </div>
          </div>

          <p className="text-helper text-slate-600 dark:text-slate-400">Nutritional logging active</p>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${foodPercentage}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}
