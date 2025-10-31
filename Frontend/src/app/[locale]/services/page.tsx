'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';

// Dynamically import components with SSR disabled
const Navbar = dynamic(() => import('@/components/Navbar').then(mod => mod.default), { ssr: false });
const ServicesList = dynamic(
  () => import('@/components/ServicesList').then(mod => mod.ServicesList),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
);

// Loading component for the entire page
function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const t = useTranslations('ServicesSection');
  return (
    <Suspense fallback={<Loading />}>
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                {t('title')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
                {t('subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ServicesList />
          </div>
        </section>

      </main>
    </Suspense>
  );
}
