'use client';

import Navbar from '@/components/Navbar';
import {
  HeroSection,
  ServicesSection,
  PortfolioSection,
  BlogSection,
  ContactSection,
} from '@/sections';
import { useTranslations } from 'next-intl';

interface HomeContentProps {
  locale: string;
}

export function HomeContent({ locale }: HomeContentProps) {
  const t = useTranslations('Index');
  
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <BlogSection />
      <ContactSection />
    </main>
  );
}
