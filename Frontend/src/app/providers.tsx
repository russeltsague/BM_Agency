'use client';

import { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { NextIntlClientProvider } from 'next-intl';

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

  return (
    <NextIntlClientProvider {...providerProps}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}
