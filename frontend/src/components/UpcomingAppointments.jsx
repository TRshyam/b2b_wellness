import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Video, UserCheck, XCircle } from 'lucide-react';

export default function UpcomingAppointments({ appointments, onQuickAction, onViewVendor }) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="dashboard-card p-6 md:p-8 mb-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-card-title text-slate-900 dark:text-white">No Upcoming Appointments</h3>
        <p className="text-helper text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          You currently have no scheduled 1:1 sessions. Explore your active recommendations above to book your next wellness session.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-6 md:p-8 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            My Upcoming Appointments
          </h2>
          <p className="text-helper text-slate-600 dark:text-slate-400">Scheduled 1:1 wellness sessions & consultation visits</p>
        </div>
        <span className="text-helper font-bold px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
          {appointments.length} Confirmed
        </span>
      </div>

      <div className="space-y-4">
        {appointments.map((appt) => (
          <div
            key={appt.appointment_id}
            className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 card-elevation-1 transition-all"
          >
            {/* Left Info */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-md shrink-0">
                {appt.service_name ? appt.service_name.charAt(0) : 'S'}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-card-title text-slate-900 dark:text-white font-bold">{appt.service_name}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10">
                    {appt.category ? appt.category.replace('_', ' ') : 'Wellness'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {appt.appointment_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {appt.location}
                  </span>
                </div>

                {appt.vendor_name && (
                  <button
                    onClick={() => onViewVendor && onViewVendor(appt.vendor_name, appt.vendor_email, appt.location)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Provider: {appt.vendor_name}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-white/10">
              {appt.location.toLowerCase().includes('online') ? (
                <button
                  onClick={() => onQuickAction(appt.appointment_id, 'join')}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" /> Join Session
                </button>
              ) : (
                <button
                  onClick={() => onQuickAction(appt.appointment_id, 'check_in')}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Check In
                </button>
              )}

              <button
                onClick={() => onQuickAction(appt.appointment_id, 'reschedule')}
                className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-white/10 transition-colors"
              >
                Reschedule
              </button>

              <button
                onClick={() => onQuickAction(appt.appointment_id, 'cancel')}
                className="py-2 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs transition-colors"
                title="Cancel Appointment"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
