'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, AuthProvider } from '@/contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Image,
  Package,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Services',
    href: '/admin/services',
    icon: Settings,
  },
  {
    title: 'Portfolio',
    href: '/admin/portfolio',
    icon: Image,
  },
  {
    title: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    title: 'Testimonials',
    href: '/admin/testimonials',
    icon: Users,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AuthProvider>
    </QueryClientProvider>
  )
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed left-0 top-0 z-50 h-full w-64 bg-slate-800 shadow-lg lg:translate-x-0"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-700">
            <h1 className="text-xl font-bold text-blue-400">
              BM Agency
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-900/50 text-blue-400'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/30">
                <User className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-slate-800 border-b border-slate-700 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden lg:block">
                <h2 className="text-lg font-semibold text-slate-100">
                  {sidebarItems.find(item => item.href === pathname)?.title || 'Dashboard'}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-slate-300">
                Welcome back, {user?.name || 'Admin'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
