import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, ShieldCheck, Phone, MapPin, Briefcase, Heart, Award } from 'lucide-react';

export default function Profile({ onNavigate }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Top Profile Banner */}
      <div className="dashboard-card p-6 md:p-8 card-elevation-2 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-3xl flex items-center justify-center shadow-xl">
              {user.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-page-title text-slate-900 dark:text-white font-black">{user.full_name}</h1>
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-body text-slate-600 dark:text-slate-400 font-semibold">{user.role} — {user.department}</p>
              <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                  Active Employee ({user.employee_id})
                </span>
                <span>• {user.work_mode || 'Hybrid Work Mode'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold border border-slate-300 dark:border-white/10 transition-colors self-start md:self-auto"
          >
            Edit Profile Settings
          </button>
        </div>
      </div>

      {/* Grid: Employment Info & Health Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employment & Corporate Information */}
        <div className="dashboard-card p-6 md:p-8 space-y-4">
          <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Corporate Information
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/10">
              <span className="text-slate-500 font-medium">Corporate Email:</span>
              <span className="font-bold text-slate-900 dark:text-white">{user.email}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/10">
              <span className="text-slate-500 font-medium">Reporting Manager:</span>
              <span className="font-bold text-slate-900 dark:text-white">{user.manager_name || 'Executive Manager'}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/10">
              <span className="text-slate-500 font-medium">Sub-Team:</span>
              <span className="font-bold text-slate-900 dark:text-white">{user.team_name || 'Core Operations'}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/10">
              <span className="text-slate-500 font-medium">Office Location:</span>
              <span className="font-bold text-slate-900 dark:text-white">{user.office_location || 'San Francisco Headquarters'}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Emergency Contact:</span>
              <span className="font-bold text-slate-900 dark:text-white">{user.emergency_contact_name || 'Emergency Contact On File'}</span>
            </div>
          </div>
        </div>

        {/* Personalized Health Targets */}
        <div className="dashboard-card p-6 md:p-8 space-y-4">
          <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            Personal Health Targets
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/10">
              <span className="text-slate-500 font-medium">Target Sleep Duration:</span>
              <span className="font-bold text-slate-900 dark:text-white">{user.target_sleep_hours || 8.0} hrs / night</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/10">
              <span className="text-slate-500 font-medium">Target Daily Hydration:</span>
              <span className="font-bold text-slate-900 dark:text-white">{user.target_daily_hydration_liters || 2.5} Liters (8 glasses)</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-white/10">
              <span className="text-slate-500 font-medium">Target Weekly Activity:</span>
              <span className="font-bold text-slate-900 dark:text-white">{user.target_weekly_exercise_minutes || 150} Minutes / week</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Primary Wellness Goal:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{user.wellness_goal || 'Circadian Rest & Metabolic Energy'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
