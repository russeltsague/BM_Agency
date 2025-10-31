'use client';

import { useState, useMemo, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/ThemeProvider';

interface ProvidersProps {
  children: React.ReactNode;
  locale?: string;
  messages?: any;
}

export function Providers({ 
  children,
  locale = 'fr', // Default to 'fr' if not provided
  messages = {} // Default to empty object if not provided
}: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  // Memoize the provider props to prevent unnecessary re-renders
  const providerProps = useMemo(() => ({
    locale: locale || 'fr', // Default to 'fr' if locale is not provided
    messages: messages || {},
    onError: (error: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('NextIntl error:', error);
      }
    },
    getMessageFallback: ({ key, error }: { key: string; error: any }) => {
      if (error?.code === 'MISSING_MESSAGE') {
        return key;
      }
      return '...';
    },
    timeZone: 'Europe/Paris',
    now: new Date()
  }), [locale, messages]);

  // Add a client-side effect to handle theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Get the theme from localStorage or default to system preference
    const theme = localStorage.getItem('camer-digital-agency-ui-theme') || 'system';
    
    if (theme === 'dark' || (theme === 'system' && 
        window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, []);

  return (
    <NextIntlClientProvider {...providerProps}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}
