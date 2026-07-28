import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const services = [
    { title: 'Deep Tissue Recovery Massage', category: 'Massage Therapy', desc: '60 min therapeutic massage' },
    { title: 'Hydrotherapy & Thermal Springs Access', category: 'Thermal Spa', desc: 'Mineral springs day pass' },
    { title: 'Infrared Cedar Sauna Session', category: 'Sauna & Detox', desc: '45 min detox session' },
    { title: 'Personalized Nutrition Consult', category: 'Nutrition', desc: '1-on-1 diet roadmap' },
    { title: 'Restorative Yin Yoga & Breathwork', category: 'Yoga & Mindfulness', desc: '60 min guided breathwork' },
    { title: 'Corporate Mindful Leadership Workshop', category: 'On-Premise Events', desc: '120 min stress workshop' },
  ];

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="accent-glass w-full max-w-xl p-6 rounded-3xl border border-slate-200 dark:border-white/20 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search corporate services, workshops, or vendors..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="border-t border-slate-200 dark:border-white/10 pt-3 max-h-80 overflow-y-auto space-y-2">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No matching services found.</p>
          ) : (
            filtered.map((item, index) => (
              <div
                key={index}
                onClick={onClose}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{item.category} — {item.desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
