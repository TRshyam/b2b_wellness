import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, User, LogOut, Menu, Search, Bell, ChevronRight, LayoutDashboard, Sun, Moon, Laptop } from 'lucide-react';

export default function Header({ currentRoute, onNavigate, onToggleSidebar, onOpenSearch }) {
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const notifications = [
    { id: 1, text: 'Upcoming Massage Therapy session tomorrow at 5:30 PM', time: '2h ago', unread: true },
    { id: 2, text: 'New Mindful Leadership workshop announced for Aug 15', time: '1d ago', unread: false },
  ];

  return (
    <header className="accent-glass sticky top-0 z-30 px-6 py-3.5 mb-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-all"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> XYZ Aura
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <span className="font-bold text-slate-900 dark:text-white capitalize">
            {currentRoute === 'dashboard' ? 'Dashboard Overview' : currentRoute}
          </span>
        </div>
      </div>

      {/* Right: Quick Search, Theme Switcher, Notifications, User Profile */}
      <div className="flex items-center space-x-3">
        {/* Quick Search Button */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center space-x-2 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all"
        >
          <Search className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>Search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">⌘K</kbd>
        </button>

        {/* Theme Selector Popover */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-all"
            title={`Active Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-amber-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 top-12 w-44 accent-glass p-2 rounded-2xl border border-slate-200 dark:border-white/20 shadow-xl z-50 animate-fadeIn">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">
                Theme Mode
              </div>
              <button
                onClick={() => { setTheme('light'); setShowThemeMenu(false); }}
                className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  theme === 'light'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" /> Light
                </span>
                {theme === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
              </button>

              <button
                onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}
                className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  theme === 'dark'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-amber-400" /> Dark
                </span>
                {theme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
              </button>

              <button
                onClick={() => { setTheme('system'); setShowThemeMenu(false); }}
                className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  theme === 'system'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> System
                </span>
                {theme === 'system' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 accent-glass p-4 rounded-2xl border border-slate-200 dark:border-white/20 shadow-2xl z-50 animate-fadeIn">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-white/10 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">1 New</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-xs space-y-1">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{n.text}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        {user && (
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-white/10">
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center">
                {user.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white hidden lg:inline">{user.full_name}</span>
            </button>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
