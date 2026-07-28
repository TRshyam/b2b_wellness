import React from 'react';

export function SnapshotSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 skeleton-pulse rounded"></div>
            <div className="h-8 w-8 skeleton-pulse rounded-xl"></div>
          </div>
          <div className="h-8 w-28 skeleton-pulse rounded"></div>
          <div className="h-2 w-full skeleton-pulse rounded-full"></div>
        </div>
      ))}
    </div>
  );
}

export function RecommendationsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {[1, 2].map((i) => (
        <div key={i} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 skeleton-pulse rounded"></div>
            <div className="h-6 w-6 skeleton-pulse rounded-full"></div>
          </div>
          <div className="h-5 w-48 skeleton-pulse rounded"></div>
          <div className="h-16 w-full skeleton-pulse rounded-xl"></div>
          <div className="h-10 w-full skeleton-pulse rounded-xl"></div>
        </div>
      ))}
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/10 space-y-4">
      <div className="h-5 w-40 skeleton-pulse rounded mb-4"></div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 w-full skeleton-pulse rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}
