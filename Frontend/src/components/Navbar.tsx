'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MotionDiv } from '@/components/MotionComponents'
import { Menu, X, Phone, Mail } from 'lucide-react'
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-slate-900/95 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-primary-600 dark:text-blue-400"
            >
              BM Agency
            </MotionDiv>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                <MotionDiv
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              +237 222 123 456
            </Button>
            <Button size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Devis gratuit
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 pb-2">
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="w-full justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +237 222 123 456
                </Button>
                <Button className="w-full justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Devis gratuit
                </Button>
              </div>
            </div>
          </div>
        </MotionDiv>
      )}
    </nav>
  )
}
