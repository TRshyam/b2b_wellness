import React from 'react';

export default function WelcomeSection({ user, snapshot }) {
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Priya';

  const hour = new Date().getHours();
  let timeGreeting = 'Good Morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good Afternoon';
  } else if (hour >= 17) {
    timeGreeting = 'Good Evening';
  }

  let wellnessMsg = "Your physiological indicators show active recovery opportunities today.";
  if (snapshot?.avg_sleep_hours && snapshot.avg_sleep_hours < 6.0) {
    wellnessMsg = `Your 14-day sleep average is ${snapshot.avg_sleep_hours} hrs/night. We've highlighted circadian recovery and thermal spa interventions for you below.`;
  } else if (snapshot?.avg_hydration_glasses && snapshot.avg_hydration_glasses < 6.0) {
    wellnessMsg = `Your hydration level is currently below target at ${snapshot.avg_hydration_glasses} glasses/day. Small hydration adjustments can boost metabolic energy today.`;
  }

  return (
    <div className="mb-8">
      <h1 className="text-page-title text-slate-900 dark:text-white mb-1">
        {timeGreeting}, {firstName} 👋
      </h1>
      <p className="text-body text-slate-600 dark:text-slate-400 max-w-3xl">
        {wellnessMsg}
      </p>
    </div>
  );
}
