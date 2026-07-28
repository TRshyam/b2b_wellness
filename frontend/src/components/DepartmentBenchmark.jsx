import React from 'react';
import { Building2, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function DepartmentBenchmark({ benchmarks }) {
  if (!benchmarks || benchmarks.length === 0) return null;

  return (
    <div className="dashboard-card p-6 md:p-8 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Anonymous Department Benchmarks
          </h2>
          <p className="text-helper text-slate-600 dark:text-slate-400">Aggregated corporate wellness scores with privacy guardrails (min 5 employees)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {benchmarks.map((dept, index) => (
          <div key={index} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-card-title text-slate-900 dark:text-white">{dept.department}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{dept.employee_count} emp</span>
            </div>

            {dept.status === 'Available' ? (
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-300">{dept.average_score}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Anonymized
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-indigo-500 dark:bg-indigo-400 h-full rounded-full"
                    style={{ width: `${dept.average_score}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Privacy Guardrail Active
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-500">Requires ≥5 employees for aggregated reporting.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
