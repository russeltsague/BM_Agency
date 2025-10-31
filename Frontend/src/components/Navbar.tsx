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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-slate-900/95 dark:border-slate-800/80 w-full overflow-hidden shadow-sm dark:shadow-slate-900/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 w-full">
        <div className="flex items-center h-16 w-full">
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

          {/* Navigation Links */}
          <div className="hidden md:block flex-1">
            <div className="flex items-center space-x-4 ml-4">
              {navItems.map((item, index) => (
                <MotionDiv
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/${locale}${item.href === '/' ? '' : item.href}`}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-150 rounded-md ${
                      path === item.href 
                        ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-slate-800/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    {item.label}
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>
          
          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden lg:flex min-w-0 px-3 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 border-gray-300 dark:border-slate-600"
              >
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="hidden xl:inline truncate">+237 675176974</span>
                <span className="xl:hidden">Tel</span>
              </Button>
              <Button 
                size="sm" 
                className="hidden lg:flex min-w-0 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="hidden xl:inline truncate">{t('getQuote')}</span>
                <span className="xl:hidden">Devis</span>
              </Button>
              <Link href={`/${locale}/admin/login`}>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="min-w-0 px-3 py-2 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 border-gray-300 dark:border-slate-600"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Admin</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-end space-x-2 min-w-0 ml-auto flex-shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800/80 transition-colors duration-200"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-800">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">Menu</div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href === '/' ? '' : item.href}`}
              className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                path === item.href
                  ? 'bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800/80'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Contact Buttons */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 mt-4">
          <div className="space-y-3">
            <a
              href="tel:+237675176974"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-700"
            >
              <Phone className="w-4 h-4 mr-2" />
              +237 675 176 974
            </a>
            <Link
              href={`/${locale}/contact`}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 border border-transparent rounded-md shadow-sm hover:from-blue-700 hover:to-cyan-700"
              onClick={() => setIsOpen(false)}
            >
              <Mail className="w-4 h-4 mr-2" />
              {t('getQuote')}
            </Link>
            <Link 
              href={`/${locale}/admin/login`}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-700"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Link>
          </div>
        </div>

        {/* Theme and Language Toggles */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex justify-center space-x-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
