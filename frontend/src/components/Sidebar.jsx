import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  LayoutDashboard,
  HeartPulse,
  Calendar,
  Users,
  Activity,
  User,
  Settings,
  LogOut,
  Search,
  ChevronRight,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onTabChange,
  isMobileOpen,
  onMobileClose,
  onOpenSearch
}) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wellness', label: 'Wellness Overview', icon: HeartPulse },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'events', label: 'Events & Workshops', icon: Users },
    { id: 'usage', label: 'Service Usage', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 accent-glass flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-200 dark:border-white/10 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Branding Section */}
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => {
                onTabChange('dashboard');
                onMobileClose();
              }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-card-title text-slate-900 dark:text-white flex items-center gap-1.5 font-black">
                  XYZ <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Aura</span>
                </h1>
                <p className="text-helper text-slate-500 dark:text-slate-400 font-medium">Corporate Wellness</p>
              </div>
            </div>

            <button
              onClick={onMobileClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Shortcut */}
          <div className="p-4">
            <button
              onClick={() => {
                onOpenSearch();
                onMobileClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-helper font-medium flex items-center justify-between transition-all group"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Search services...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onMobileClose();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-body font-semibold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        {user && (
          <div className="p-4 border-t border-slate-200 dark:border-white/10">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
                  {user.full_name ? user.full_name.charAt(0) : 'U'}
                </div>
                <div className="truncate">
                  <div className="text-helper font-bold text-slate-900 dark:text-white truncate">{user.full_name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.department}</div>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
