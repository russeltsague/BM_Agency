'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const changeLanguage = (newLocale: string) => {
    if (!isMounted || !pathname) return;
    
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  if (!isMounted) return null;

  return (
    <div className="flex items-center border border-gray-200 dark:border-slate-600 rounded-md overflow-hidden h-8">
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-2 h-full flex items-center justify-center ${
          currentLocale === 'fr' 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
        }`}
        aria-label="Changer en français"
      >
        FR
      </button>
      <div className="h-4 w-px bg-gray-200 dark:bg-slate-600"></div>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 h-full flex items-center justify-center ${
          currentLocale === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}