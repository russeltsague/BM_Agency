'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Create a loading component
const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 ${className}`} />
);

// Dynamically import components with proper typing
const Navbar = dynamic(() => import('@/components/Navbar'), { 
  ssr: false,
  loading: () => <LoadingSkeleton className="w-full h-16" />
});

// For named exports, we need to use a different approach
const HeroSection = dynamic(
  () => import('@/sections/HeroSection').then(mod => mod.HeroSection as any),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton className="w-full h-screen" />
  }
);

const ServicesSection = dynamic(
  () => import('@/sections/ServicesSection').then(mod => mod.ServicesSection as any),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton className="w-full h-screen" />
  }
);

const PortfolioSection = dynamic(
  () => import('@/sections/PortfolioSection').then(mod => mod.PortfolioSection as any),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton className="w-full h-screen" />
  }
);

const BlogSection = dynamic(
  () => import('@/sections/BlogSection').then(mod => mod.BlogSection as any),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton className="w-full h-screen" />
  }
);

const ContactSection = dynamic(
  () => import('@/sections/ContactSection').then(mod => mod.ContactSection as any),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton className="w-full h-screen" />
  }
);

const Footer = dynamic(
  () => import('@/components/Footer').then(mod => mod.Footer as any),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton className="w-full h-64" />
  }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
