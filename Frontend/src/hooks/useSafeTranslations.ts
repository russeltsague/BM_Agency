'use client';

import { useTranslations as useNextIntlTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type TranslationFunction = (key: string, fallback?: string) => string;

export function useSafeTranslations(namespace?: string) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Default translation function that returns the key or fallback
  const defaultT: TranslationFunction = (key: string, fallback?: string) => fallback || key;
  
  // Try to use the actual translations if available
  let t = defaultT;
  try {
    const translations = useNextIntlTranslations(namespace);
    if (translations) {
      t = (key: string, fallback?: string) => {
        try {
          const result = translations(key);
          return result || fallback || key;
        } catch (e) {
          console.warn(`Translation not found for key "${key}", using ${fallback ? 'fallback' : 'key'}`);
          return fallback || key;
        }
      };
    }
  } catch (e) {
    console.error('Translation initialization error:', e);
  }
  
  // Set mounted state to handle SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Return a safe translation function with fallback support
  return (key: string, fallback?: string) => {
    if (!isMounted) return fallback || key;
    try {
      const result = t(key, fallback);
      return result || fallback || key;
    } catch (e) {
      console.warn(`Translation error for key "${key}":`, e);
      return fallback || key;
    }
  };
}
