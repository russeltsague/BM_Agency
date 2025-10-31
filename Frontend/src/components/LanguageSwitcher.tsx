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
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-3 py-1 rounded-md ${
          currentLocale === 'fr' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
        }`}
        aria-label="Changer en français"
      >
        FR
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-md ${
          currentLocale === 'en' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}