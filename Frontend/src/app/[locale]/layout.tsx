'use client';

import { notFound } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Providers } from '../providers';

// Dynamically import Navbar and Footer with SSR disabled
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(
  () => import('@/components/Footer').then(mod => mod.Footer),
  { 
    ssr: false,
    loading: () => null
  }
);

interface LocaleLayoutProps {
  children: ReactNode;
  params: { 
    locale: string;
  };
}

export default function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  const [messages, setMessages] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate locale
  if (!['en', 'fr'].includes(locale)) {
    notFound();
  }

  useEffect(() => {
    // Load messages on the client side
    const loadMessages = async () => {
      try {
        // Import the messages directly from the messages directory
        const messagesModule = await import(`@/messages/${locale}.json`);
        // Access the default export which contains our messages
        const messages = messagesModule.default || messagesModule;
        setMessages(messages);
      } catch (error) {
        console.error('Error loading messages:', error);
        // Fallback to empty object to prevent app from breaking
        setMessages({});
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [locale]);

  if (isLoading || !messages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Ensure we have valid messages before rendering
  if (!messages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Providers 
      locale={locale} 
      messages={{
        ...messages,
        // Add any common messages that should be available everywhere
        common: {
          // Add common messages here if needed
        }
      }}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  );
}