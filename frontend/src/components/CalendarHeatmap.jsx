import React from 'react';
import { Calendar } from 'lucide-react';

export default function CalendarHeatmap({ logs_50d }) {
  if (!logs_50d || logs_50d.length === 0) return null;

  const getHeatmapColor = (log) => {
    if (!log) return 'bg-slate-200 dark:bg-slate-900 border-slate-300 dark:border-white/5';
    const sleep = log.sleep_hours || 0;
    const hyd = log.hydration_glasses || (log.hydration_oz ? log.hydration_oz / 8.0 : 0);
    const food = log.healthy_food_logged || 0;

    if (sleep >= 7.0 && hyd >= 7.0 && food === 1) {
      return 'bg-emerald-500 text-white border-emerald-400 dark:bg-emerald-500/80 dark:border-emerald-400/50'; // Optimal
    } else if (sleep >= 6.0 && hyd >= 6.0) {
      return 'bg-teal-500 text-white border-teal-400 dark:bg-teal-500/60 dark:border-teal-400/30'; // Good
    } else if (sleep < 6.0 || hyd < 6.0) {
      return 'bg-amber-500 text-white border-amber-400 dark:bg-amber-500/50 dark:border-amber-400/30'; // Low
    }
    return 'bg-purple-500 text-white border-purple-400 dark:bg-purple-500/40 dark:border-purple-400/20';
  };

  return (
    <div className="dashboard-card p-6 md:p-8 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            50-Day Wellness Logging Activity
          </h2>
          <p className="text-helper text-slate-600 dark:text-slate-400">Daily health tracking consistency (June 5 – July 24, 2026)</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span>Needs Attention</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-teal-500"></div>
            <span>Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span>Optimal</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-25 gap-2 pt-2">
        {logs_50d.map((log, index) => (
          <div
            key={index}
            title={`Date: ${log.log_date} | Sleep: ${log.sleep_hours}h | Hydration: ${log.hydration_glasses || (log.hydration_oz ? (log.hydration_oz/8).toFixed(1) : 0)}g | Mood: ${log.mood_score}`}
            className={`h-8 rounded-lg border transition-all cursor-pointer hover:scale-110 flex items-center justify-center text-[10px] font-mono font-bold ${getHeatmapColor(log)}`}
          >
            {log.log_date.split('-')[2]}
          </div>
        ))}
      </div>
    </div>
  );
}
