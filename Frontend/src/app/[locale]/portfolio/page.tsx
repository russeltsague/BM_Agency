'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the PortfolioContent component with SSR disabled
const PortfolioContent = dynamic(() => import('./PortfolioContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <span className="ml-2">Loading portfolio...</span>
    </div>
  ),
});

export default function PortfolioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2">Loading portfolio...</span>
      </div>
    }>
      <PortfolioContent />
    </Suspense>
  );
}
