'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  FileText,
  Users,
  Menu,
  X,
  LogOut,
  User,
  Plus
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
    icon: ImageIcon,
  },
  {
    title: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    title: 'Team',
    href: '/admin/team',
    icon: Users,
  },
  {
    title: 'Testimonials',
    href: '/admin/testimonials',
    icon: Users,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </QueryClientProvider>
  )
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Redirect to login if not authenticated (but not on login page itself)
  useEffect(() => {
    if (!user && pathname !== '/admin/login') {
      window.location.href = '/admin/login'
    }
  }, [user, pathname])

  // Don't render anything if user is not authenticated (but not on login page)
  if (!user && pathname !== '/admin/login') {
    return null
  }

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

      {/* Sidebar - Hidden on mobile, visible on large screens */}
      <aside className={`fixed left-0 top-0 z-50 h-full w-64 bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-700">
            <div className="flex items-center">
              <Image
                src="/images/lightlogo2.png"
                alt="BM Agency Logo"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
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
                const IconComponent = item.icon
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
                      <IconComponent className="mr-3 h-5 w-5" />
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/admin/services"
                  className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Plus className="mr-3 h-4 w-4" />
                  Add Service
                </Link>
                <Link
                  href="/admin/blog"
                  className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FileText className="mr-3 h-4 w-4" />
                  New Article
                </Link>
                <Link
                  href="/admin/portfolio"
                  className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ImageIcon className="mr-3 h-4 w-4" />
                  Add Project
                </Link>
                <Link
                  href="/admin/testimonials"
                  className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Users className="mr-3 h-4 w-4" />
                  Add Testimonial
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Users className="mr-3 h-4 w-4" />
                  Manage Users
                </Link>
              </div>
            </div>
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
              className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400/50 transition-all duration-200 shadow-sm"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:ml-64">
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
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/lightlogo2.png"
                    alt="BM Agency Logo"
                    width={100}
                    height={33}
                    className="h-6 w-auto object-contain"
                  />
                  <span className="text-lg font-semibold text-slate-100">
                    {sidebarItems.find(item => item.href === pathname)?.title || 'Dashboard'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-slate-300">
                Welcome back, {user?.name || 'Admin'}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutDialog(true)}
                className="border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/15 hover:text-red-300 hover:border-red-400/60 transition-all duration-200 shadow-sm backdrop-blur-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
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

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Logout</DialogTitle>
            <DialogDescription className="text-slate-300">
              Are you sure you want to logout? You will need to login again to access the admin dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="border-slate-600 hover:bg-slate-700 hover:text-slate-200 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                logout()
                setShowLogoutDialog(false)
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Confirm Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
