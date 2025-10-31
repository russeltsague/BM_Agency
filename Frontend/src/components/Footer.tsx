'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { MotionDiv, MotionH4, MotionLi, MotionA } from '@/components/MotionComponents';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './Button';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Footer');

  // Helper function to ensure URLs have the current locale
  const withLocale = (path: string) => {
    // Don't add locale if it's already there or if it's an external URL
    if (path.startsWith('http') || path.startsWith(`/${locale}`)) return path;
    return `/${locale}${path}`;
  };

  const footerLinks = {
    services: [
      { href: withLocale('/services'), label: t('services.digital') },
      { href: withLocale('/services'), label: t('services.marketing') },
      { href: withLocale('/services'), label: t('services.advertising') },
      { href: withLocale('/services'), label: t('services.content') },
    ],
    company: [
      { href: withLocale('/agence'), label: t('company.about') },
      { href: withLocale('/equipe'), label: t('company.team') },
      { href: withLocale('/contact'), label: t('company.contact') },
      { href: withLocale('/recrutement'), label: t('company.recruitment') },
    ],
    legal: [
      { href: withLocale('/mentions-legales'), label: t('legal.terms') },
      { href: withLocale('/politique-confidentialite'), label: t('legal.privacy') },
      { href: withLocale('/conditions-generales'), label: t('legal.conditions') },
    ],
  }

  const socialLinks = [
    { href: 'https://www.facebook.com/share/1BVBZarSbm/?mibextid=wwXIfr', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com/votreentreprise', icon: Twitter, label: 'Twitter' },
    { href: 'https://instagram.com/votreentreprise', icon: Instagram, label: 'Instagram' },
    { href: 'https://www.linkedin.com/company/agency-bm/', icon: Linkedin, label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <Image
                  src="/images/Lightlogo.png"
                  alt="BM Agency Logo"
                  width={400}
                  height={134}
                  className="h-24 w-auto object-contain"
                />
              </div>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                {t('description')}
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {t('address.line1')}<br />
                  {t('address.line2')}
                </div>
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <Phone className="w-4 h-4 mr-2" />
                  {t('phone')}
                </div>
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <Mail className="w-4 h-4 mr-2" />
                  {t('email')}
                </div>
              </div>
            </MotionDiv>
          </div>

          {/* Services */}
          <div>
            <MotionH4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100"
            >
              {t('sections.services')}
            </MotionH4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <MotionLi
                  key={`${link.href}-${link.label}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </MotionLi>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <MotionH4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100"
            >
              {t('sections.company')}
            </MotionH4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <MotionLi
                  key={`${link.href}-${link.label}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </MotionLi>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <MotionH4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100"
            >
              {t('newsletter.title')}
            </MotionH4>
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              {t('newsletter.description')}
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <Button size="sm" className="w-full">
                {t('newsletter.button')}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 dark:border-slate-700 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              © {currentYear} {t('copyright')}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social, index) => (
                <MotionA
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </MotionA>
              ))}
            </div>
          </div>
        </MotionDiv>
      </div>
    </footer>
  )
}
