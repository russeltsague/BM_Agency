'use client';

import { useTranslations as useNextIntlTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type TranslationFunction = (key: string) => string;

export function useSafeTranslations(namespace?: string) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Default translation function that returns the key
  const defaultT: TranslationFunction = (key: string) => key;
  
  // Try to use the actual translations if available
  let t = defaultT;
  try {
    const translations = useNextIntlTranslations(namespace);
    if (translations) {
      t = (key: string) => {
        try {
          return translations(key);
        } catch (e) {
          console.error(`Translation error for key "${key}":`, e);
          return key;
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
  
  // Return a safe translation function
  return (key: string) => {
    if (!isMounted) return key;
    try {
      return t(key);
    } catch (e) {
      console.error(`Translation error for key "${key}":`, e);
      return key;
    }
  };
}
