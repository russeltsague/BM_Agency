'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useParams } from 'next/navigation';
import { MotionDiv } from '@/components/MotionComponents';
import { Phone, Mail, Menu, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useSafeTranslations } from '@/hooks/useSafeTranslations';

interface NavItem {
  href: string;
  label: string;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  
  // Use the safe translations hook
  const t = useSafeTranslations('Navigation');

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safely get locale from params
  const locale = params?.locale || 'fr';
  
  // Remove the locale from the pathname for active link checking
  const path = pathname ? pathname.replace(/^\/(en|fr)/, '') || '/' : '/';

  // Only render navigation items when on the client side
  const navItems: NavItem[] = isClient ? [
    { href: '/', label: t('home') },
    { href: '/agence', label: t('agency') },
    { href: '/services', label: t('services') },
    { href: '/portfolio', label: t('portfolio') },
    { href: '/blog', label: t('blog') },
    { href: '/contact', label: t('contact') },
  ] : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-slate-900/95 dark:border-slate-700 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 min-w-0 w-full">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 min-w-0">
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              className="flex items-center min-w-0"
            >
              <Image
                src="/images/lightlogo2.png"
                alt="BM Agency Logo"
                width={160}
                height={53}
                className="h-10 w-auto object-contain"
                priority
              />
            </MotionDiv>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block min-w-0">
            <div className="ml-6 flex items-center space-x-1.5 lg:space-x-3">
              {navItems.map((item, index) => (
                <MotionDiv
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/${locale}${item.href === '/' ? '' : item.href}`}
                    className={`px-2.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                      path === item.href 
                        ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                        : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 min-w-0">
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-slate-600 mx-1"></div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden lg:flex min-w-0 px-3 py-1.5 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                  <span className="hidden xl:inline truncate text-sm font-medium">+237 675176974</span>
                  <span className="xl:hidden text-sm font-medium">Tel</span>
                </Button>
              </div>
              <div className="flex items-center">
                <Button 
                  size="sm" 
                  className="hidden lg:flex min-w-0 px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white dark:from-blue-600/90 dark:to-cyan-600/90 dark:hover:from-blue-600 dark:hover:to-cyan-600 transition-all shadow-sm hover:shadow-md"
                >
                  <Mail className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-white" />
                  <span className="hidden xl:inline truncate">{t('getQuote')}</span>
                  <span className="xl:hidden">Devis</span>
                </Button>
              </div>
              <div className="flex items-center">
                <Link href="/admin/login">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="min-w-0 px-3 py-1.5 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                    <span className="ml-2 text-sm font-medium">Admin</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3 min-w-0 ml-auto flex-shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 min-w-0"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-w-full overflow-hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href === '/' ? '' : item.href}`}
                className="text-gray-700 hover:text-primary-600 dark:text-slate-200 dark:hover:text-blue-300 block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/70 transition-colors truncate"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-slate-700">
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-center min-w-0 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                  <span className="truncate font-medium">+237 675176974</span>
                </Button>
                <Button 
                  className="w-full justify-center min-w-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white dark:from-blue-600/90 dark:to-cyan-600/90 dark:hover:from-blue-600 dark:hover:to-cyan-600 transition-all shadow-sm hover:shadow-md"
                >
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0 text-white" />
                  <span className="truncate font-medium">{t('getQuote')}</span>
                </Button>
                <Link href="/admin/login">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center min-w-0 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                    <span className="truncate font-medium">Admin</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </MotionDiv>
      )}
    </nav>
  );
};

export default Navbar;
