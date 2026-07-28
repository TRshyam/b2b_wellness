import React, { useState } from 'react';
import { Users, Calendar, CheckCircle2, AlertCircle, Clock, MapPin, KeyRound } from 'lucide-react';

export default function RegisteredEvents({ eventsData }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  if (!eventsData || !eventsData.events || eventsData.events.length === 0) {
    return (
      <div className="dashboard-card p-6 md:p-8 mb-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-card-title text-slate-900 dark:text-white">No Registered Events</h3>
        <p className="text-helper text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          You have not registered for any group corporate workshops yet. Check back for upcoming events.
        </p>
      </div>
    );
  }

  const { events, summary } = eventsData;

  const filteredEvents = events.filter((e) => {
    if (activeTab === 'upcoming') return e.status === 'REGISTERED';
    if (activeTab === 'attended') return e.status === 'ATTENDED';
    return e.status === 'MISSED';
  });

  return (
    <div className="dashboard-card p-6 md:p-8 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Events & Group Workshops
          </h2>
          <p className="text-helper text-slate-600 dark:text-slate-400">On-premise corporate seminars & mindfulness retreats</p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Registered ({summary.registered_count})
          </button>
          <button
            onClick={() => setActiveTab('attended')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'attended'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Attended ({summary.attended_count})
          </button>
          <button
            onClick={() => setActiveTab('missed')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'missed'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Missed ({summary.missed_count})
          </button>
        </div>
      </div>

      {/* Events Connected Node Vertical Timeline */}
      {filteredEvents.length === 0 ? (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 text-center text-xs text-slate-500">
          No events found in this category.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
          {filteredEvents.map((evt) => (
            <div key={evt.event_id} className="relative group">
              {/* Timeline Connected Circle Node */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 space-y-3 card-elevation-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-card-title text-slate-900 dark:text-white">{evt.event_title}</h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                      {evt.event_category.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0 self-start sm:self-auto">
                    Status: {evt.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    {evt.event_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {evt.location}
                  </span>
                </div>

                {evt.passcode && (
                  <div className="pt-1 flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Workshop Entry Passcode:</span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-amber-500" />
                      {evt.passcode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
