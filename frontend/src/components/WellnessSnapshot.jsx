import React from 'react';
import { Moon, Droplets, Utensils, Smile, TrendingDown, TrendingUp, Minus, CheckCircle, AlertTriangle } from 'lucide-react';

export default function WellnessSnapshot({ snapshot }) {
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

  const getMoodTrendIcon = () => {
    if (mood_trend === 'Declining') {
      return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
    } else if (mood_trend === 'Improving') {
      return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
    }
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  const sleepPercentageDelta = avg_sleep_hours < 6.0 ? '-12%' : '+8%';
  const foodPercentage = Math.round((healthy_food_logged_days / total_days_logged) * 100);

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2 tracking-tight">
            My Wellness Snapshot
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
              14-Day Rolling Window
            </span>
          </h2>
          <p className="text-xs text-slate-400">Physiological health trends & emotional vitality index</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Sleep Metric Card */}
        <div className="glass-panel p-5 rounded-2xl glass-card-interactive relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 glow-orb-purple rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Sleep Quality</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Moon className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-3xl font-black text-white tracking-tight">
              {avg_sleep_hours} <span className="text-xs font-medium text-slate-400">hrs/night</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
              avg_sleep_hours < 6.0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {avg_sleep_hours < 6.0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {sleepPercentageDelta}
            </span>
          </div>

          <p className="text-xs text-purple-200/80 font-medium truncate mt-1">
            {sleep_trend}
          </p>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                avg_sleep_hours < 6.0 ? 'bg-rose-400' : 'bg-purple-400'
              }`}
              style={{ width: `${Math.min((avg_sleep_hours / 8.0) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 2. Hydration Metric Card */}
        <div className="glass-panel p-5 rounded-2xl glass-card-interactive relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 glow-orb-cyan rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Hydration Intake</span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Droplets className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-3xl font-black text-white tracking-tight">
              {avg_hydration_glasses} <span className="text-xs font-medium text-slate-400">glasses/day</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-400 font-medium">({avg_hydration_oz} oz/day)</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
              avg_hydration_glasses < 6.0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {avg_hydration_glasses < 6.0 ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
              {avg_hydration_glasses < 6.0 ? 'Below Target' : 'Optimal'}
            </span>
          </div>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((avg_hydration_glasses / 8.0) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 3. Healthy Food Card */}
        <div className="glass-panel p-5 rounded-2xl glass-card-interactive relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 glow-orb-emerald rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Healthy Nutrition</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Utensils className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-3xl font-black text-white tracking-tight">
              {foodPercentage}% <span className="text-xs font-medium text-slate-400">compliance</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium mt-1">
            {healthy_food_logged_days} of {total_days_logged} days logged healthy
          </div>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${foodPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* 4. Mood Index Card */}
        <div className="glass-panel p-5 rounded-2xl glass-card-interactive relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 glow-orb-emerald rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Emotional Vitality</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Smile className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <div className="text-3xl font-black text-white tracking-tight">
              {avg_mood_score} <span className="text-xs font-medium text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10">
              {getMoodTrendIcon()}
              <span>{mood_trend}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 truncate mt-1" title={mood_trend_description}>
            {mood_trend_description}
          </p>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(avg_mood_score / 5.0) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
