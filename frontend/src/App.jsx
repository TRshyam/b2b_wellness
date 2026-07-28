import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { API_BASE_URL, VERCEL_FULL_URL } from './config/api';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SearchModal from './components/SearchModal';
import WelcomeSection from './components/WelcomeSection';
import WellnessCoachCard from './components/WellnessCoachCard';
import WellnessScoreCard from './components/WellnessScoreCard';
import HeroRecommendation from './components/HeroRecommendation';
import UnifiedWellnessPanel from './components/UnifiedWellnessPanel';
import CalendarHeatmap from './components/CalendarHeatmap';
import AchievementGallery from './components/AchievementGallery';
import WeeklyInsights from './components/WeeklyInsights';
import UpcomingAppointments from './components/UpcomingAppointments';
import RegisteredEvents from './components/RegisteredEvents';
import ServiceUsage from './components/ServiceUsage';
import DepartmentBenchmark from './components/DepartmentBenchmark';
import VendorModal from './components/VendorModal';
import { SnapshotSkeleton, RecommendationsSkeleton, SectionSkeleton } from './components/SkeletonLoader';

import Login from './pages/Login';
import CreatePassword from './pages/CreatePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';

function MainAppContent() {
  const { token, user, loading, firstTimeUser, authFetch, vercelProtectedNotice } = useAuth();
  const [route, setRoute] = useState('dashboard');
  const [resetToken, setResetToken] = useState(null);

  // Layout & Modal states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dashboard components data state
  const [snapshot, setSnapshot] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState(null);
  const [usage, setUsage] = useState(null);
  const [v2Intelligence, setV2Intelligence] = useState(null);

  const [dashLoading, setDashLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Global Keyboard Shortcut (⌘K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (targetRoute) => {
    if (targetRoute.startsWith('reset_password')) {
      const parts = targetRoute.split('token=');
      if (parts.length > 1) {
        setResetToken(parts[1]);
      }
      setRoute('reset_password');
    } else {
      setRoute(targetRoute);
    }
  };

  // Fetch dashboard data when authenticated
  useEffect(() => {
    if (!token || !user) return;
    setDashLoading(true);
    setApiError(null);

    Promise.all([
      authFetch('/dashboard/wellness-snapshot').then((r) => r.ok ? r.json() : null),
      authFetch('/dashboard/recommendations').then((r) => r.ok ? r.json() : null),
      authFetch('/dashboard/upcoming-appointments').then((r) => r.ok ? r.json() : null),
      authFetch('/dashboard/registered-events').then((r) => r.ok ? r.json() : null),
      authFetch('/dashboard/service-usage').then((r) => r.ok ? r.json() : null),
      authFetch('/dashboard/v2-intelligence').then((r) => r.ok ? r.json() : null)
    ])
      .then(([snapData, recData, apptData, evtData, usageData, v2Data]) => {
        if (snapData) setSnapshot(snapData);
        if (recData) setRecommendations(recData.recommendations || []);
        if (apptData) setAppointments(apptData);
        if (evtData) setEvents(evtData);
        if (usageData) setUsage(usageData);
        if (v2Data) setV2Intelligence(v2Data);
        setDashLoading(false);
      })
      .catch((err) => {
        console.error("Error loading protected dashboard data:", err);
        setApiError("Unable to connect to Vercel API backend. Please check network connection.");
        setDashLoading(false);
      });
  }, [token, user]);

  const handleQuickAction = (appointmentId, action) => {
    authFetch(`/appointments/${appointmentId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action })
    })
      .then((res) => res.json())
      .then(() => {
        return authFetch('/dashboard/upcoming-appointments');
      })
      .then((r) => r.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Error performing quick action:", err));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex items-center justify-center p-4 transition-colors">
        <div className="text-center accent-glass p-8 rounded-3xl max-w-md">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-4"></div>
          <p className="text-body font-bold text-slate-800 dark:text-slate-300">Connecting to Vercel Corporate Backend...</p>
          <span className="text-xs text-slate-500 block mt-2 font-mono truncate">{API_BASE_URL}</span>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    if (firstTimeUser) {
      return <CreatePassword onNavigate={handleNavigate} />;
    }
    if (route === 'forgot_password') {
      return <ForgotPassword onNavigate={handleNavigate} />;
    }
    if (route === 'reset_password') {
      return <ResetPassword token={resetToken} onNavigate={handleNavigate} />;
    }
    return <Login onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 relative overflow-hidden pb-16 ambient-mesh transition-colors">
      <Sidebar
        activeTab={route}
        onTabChange={handleNavigate}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <div className="lg:pl-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Header
            currentRoute={route}
            onNavigate={handleNavigate}
            onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          {/* Vercel Deployment Protection Notice Banner */}
          {vercelProtectedNotice && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <span className="font-bold flex items-center gap-1">
                ⚠️ Vercel Deployment Protection Active
              </span>
              <p>
                The deployed backend (<code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">{VERCEL_FULL_URL}</code>) has Vercel Deployment Protection (Vercel Authentication) enabled.
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                To allow public client access, disable deployment protection in your Vercel Dashboard: <strong>Project Settings → Deployment Protection → Vercel Authentication → Off</strong>.
              </p>
            </div>
          )}

          {route === 'profile' ? (
            <Profile onNavigate={handleNavigate} />
          ) : route === 'settings' ? (
            <SettingsPage />
          ) : route === 'wellness' ? (
            <UnifiedWellnessPanel snapshot={snapshot} />
          ) : route === 'appointments' ? (
            <UpcomingAppointments
              appointments={appointments}
              onQuickAction={handleQuickAction}
              onViewVendor={(name, email, location) => setSelectedVendor({ name, email, location })}
            />
          ) : route === 'events' ? (
            <RegisteredEvents eventsData={events} />
          ) : route === 'usage' ? (
            <ServiceUsage usageData={usage} />
          ) : (
            <>
              {dashLoading ? (
                <>
                  <SnapshotSkeleton />
                  <RecommendationsSkeleton />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SectionSkeleton />
                    <SectionSkeleton />
                  </div>
                </>
              ) : (
                <>
                  {/* 1. Welcome Section */}
                  <WelcomeSection user={user} snapshot={snapshot} />

                  {/* 2. Wellness Coach AI Assistant */}
                  <WellnessCoachCard
                    persona={v2Intelligence?.persona}
                    insights={v2Intelligence?.weekly_insights}
                    user={user}
                  />

                  {/* 3. Overall Wellness Score Card & Forecast */}
                  <WellnessScoreCard
                    score={v2Intelligence?.wellness_score}
                    category={v2Intelligence?.health_category}
                    forecast={v2Intelligence?.forecast}
                    persona={v2Intelligence?.persona}
                  />

                  {/* 4. Hero Recommendation Card */}
                  <HeroRecommendation recommendations={recommendations} />

                  {/* 5. Unified Wellness Overview Panel */}
                  <UnifiedWellnessPanel snapshot={snapshot} />

                  {/* 6. 50-Day Activity Calendar Heatmap */}
                  <CalendarHeatmap logs_50d={v2Intelligence?.logs_50d} />

                  {/* 7. Achievement Gallery (Badges) */}
                  <AchievementGallery achievements={v2Intelligence?.achievements} />

                  {/* 8. Weekly Insights */}
                  <WeeklyInsights insights={v2Intelligence?.weekly_insights} />

                  {/* 9. Upcoming Appointments */}
                  <UpcomingAppointments
                    appointments={appointments}
                    onQuickAction={handleQuickAction}
                    onViewVendor={(name, email, location) => setSelectedVendor({ name, email, location })}
                  />

                  {/* 10. Events Vertical Timeline */}
                  <RegisteredEvents eventsData={events} />

                  {/* 11. Service Usage Summary */}
                  <ServiceUsage usageData={usage} />

                  {/* 12. Department Benchmarks (Privacy Guardrail) */}
                  <DepartmentBenchmark benchmarks={v2Intelligence?.department_benchmarks} />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {selectedVendor && (
        <VendorModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
