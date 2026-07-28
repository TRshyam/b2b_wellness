import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings, Sun, Moon, Laptop, Bell, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fadeIn pb-8">
      <div>
        <h1 className="text-page-title text-slate-900 dark:text-white mb-1">Account & Preference Settings</h1>
        <p className="text-body text-slate-600 dark:text-slate-400">Configure theme appearance, notification dispatching, and security options.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-fadeIn">
          ✓ Preferences saved successfully!
        </div>
      )}

      {/* Theme Selection Panel */}
      <div className="dashboard-card p-6 md:p-8 space-y-4">
        <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          Appearance & Theme Mode
        </h2>
        <p className="text-helper text-slate-600 dark:text-slate-400">Select your preferred color interface mode.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${
              theme === 'light'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-md'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-6 h-6 text-amber-500" />
            <span className="text-body">Light Theme</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${
              theme === 'dark'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-md'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-6 h-6 text-amber-400" />
            <span className="text-body">Dark Theme</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${
              theme === 'system'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-md'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Laptop className="w-6 h-6 text-cyan-500" />
            <span className="text-body">System Mode</span>
          </button>
        </div>
      </div>

      {/* Notifications Panel */}
      <form onSubmit={handleSave} className="dashboard-card p-6 md:p-8 space-y-4">
        <h2 className="text-section-title text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          Notification Preferences
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 cursor-pointer">
            <div>
              <span className="text-card-title text-slate-900 dark:text-white block">Email Notifications</span>
              <span className="text-helper text-slate-500">Receive appointment reminders & weekly wellness reports via email</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 cursor-pointer">
            <div>
              <span className="text-card-title text-slate-900 dark:text-white block">SMS Notifications</span>
              <span className="text-helper text-slate-500">Receive urgent intervention alerts on mobile device</span>
            </div>
            <input
              type="checkbox"
              checked={smsNotifs}
              onChange={(e) => setSmsNotifs(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-md"
          >
            Save Preference Changes
          </button>
        </div>
      </form>
    </div>
  );
}
