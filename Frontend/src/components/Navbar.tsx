'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MotionDiv } from '@/components/MotionComponents'
import { Phone, Mail, Menu, X, User, Settings } from 'lucide-react'
import { Button } from './Button'
import { ThemeToggle } from './ThemeToggle'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/agence', label: 'L\'Agence' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-slate-900/95 dark:border-slate-700 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 min-w-0 w-full">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 min-w-0">
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-blue-400 truncate"
            >
              BM Agency
            </MotionDiv>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block min-w-0">
            <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
              {navItems.map((item, index) => (
                <MotionDiv
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-blue-400 px-2 lg:px-3 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 min-w-0">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="hidden lg:flex min-w-0">
              <Phone className="w-4 h-4 mr-1 lg:mr-2 flex-shrink-0" />
              <span className="hidden xl:inline truncate">+237 222 123 456</span>
              <span className="xl:hidden">Tel</span>
            </Button>
            <Button size="sm" className="hidden lg:flex min-w-0">
              <Mail className="w-4 h-4 mr-1 lg:mr-2 flex-shrink-0" />
              <span className="hidden xl:inline truncate">Devis gratuit</span>
              <span className="xl:hidden">Devis</span>
            </Button>
            <Link href="/admin/dashboard">
              <Button size="sm" variant="outline" className="min-w-0">
                <Settings className="w-4 h-4 mr-1 lg:mr-2 flex-shrink-0" />
                <span className="hidden lg:inline">Admin</span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3 min-w-0 ml-auto flex-shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 min-w-0"
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
                href={item.href}
                className="text-gray-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 truncate"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-slate-700">
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="w-full justify-center min-w-0">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">+237 222 123 456</span>
                </Button>
                <Button className="w-full justify-center min-w-0">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Devis gratuit</span>
                </Button>
                <Link href="/admin/dashboard">
                  <Button variant="outline" className="w-full justify-center min-w-0">
                    <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Admin</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </MotionDiv>
      )}
    </nav>
  )
}
