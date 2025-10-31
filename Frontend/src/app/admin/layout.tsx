'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useTheme } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import Image from 'next/image'

interface AdminLayoutProps {
  children: React.ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { user, logout, isHydrated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()

  // Don't protect the login page - allow it to render without authentication
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Only run auth checks after hydration
    if (!isHydrated) {
      return
    }

    console.log('Admin layout - Checking user access:', user?.roles)

    // Only redirect if not on login page and no user
    if (!user && !isLoginPage) {
      const timer = setTimeout(() => {
        router.push('/admin/login')
      }, 100)
      return () => clearTimeout(timer)
    }

    // Check if user has valid role (only if not on login page)
    if (user && !isLoginPage) {
      console.log('Admin layout - Checking user roles:', user.roles);
      
      // Normalize roles to lowercase for case-insensitive comparison
      const userRoles = Array.isArray(user.roles) 
        ? user.roles.map(role => String(role).toLowerCase().trim())
        : [];
      
      // Expanded list of valid admin roles with common variations
      const validRoles = [
        'admin', 'administrator', 'superadmin', 'super_admin', 'super admin',
        'owner', 'editor', 'moderator', 'manager', 'author', 'superuser'
      ];
      
      // Check if any of the user's roles match the valid roles (case-insensitive and partial match)
      const hasValidRole = userRoles.some(role => {
        const normalizedRole = role.toLowerCase().trim();
        return validRoles.some(validRole => 
          normalizedRole.includes(validRole.toLowerCase()) || 
          validRole.toLowerCase().includes(normalizedRole)
        );
      });

      console.log('Admin layout - Raw user object:', JSON.stringify(user, null, 2));
      console.log('Admin layout - User roles:', user.roles);
      console.log('Admin layout - Normalized user roles:', userRoles);
      console.log('Admin layout - Valid roles to check against:', validRoles);
      console.log('Admin layout - Has valid role:', hasValidRole);

      if (!hasValidRole) {
        console.log('Admin layout - User does not have a valid role. User roles:', user.roles);
        const timer = setTimeout(() => {
          router.push('/admin/login')
        }, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [user, router, isLoginPage, isHydrated])

  // If not hydrated yet, show nothing to prevent SSR mismatch
  if (!isHydrated) {
    return null
  }

  // If login page, just render children without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // Check if user has valid roles (for navigation)
  const hasValidRole = isHydrated && user?.roles && Array.isArray(user.roles) && user.roles.some(role =>
    ['admin', 'owner', 'editor', 'moderator', 'manager', 'author'].includes(role.toLowerCase())
  )

  // If not login page and no user, show redirect message
  if (!isLoginPage && !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className={`p-8 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <p>Redirection vers la page de connexion...</p>
        </div>
      </div>
    )
  }

  const navigation = [
    { name: 'Tableau de Bord', href: '/admin/dashboard', current: pathname === '/admin/dashboard' },
    { name: 'Blog', href: '/admin/blog', current: pathname === '/admin/blog' },
    { name: 'Tâches', href: '/admin/tasks', current: pathname === '/admin/tasks' },
    ...(hasValidRole && isHydrated ? [
      { name: 'Services', href: '/admin/services', current: pathname === '/admin/services' },
      { name: 'Portfolio', href: '/admin/portfolio', current: pathname === '/admin/portfolio' },
      { name: 'Équipe', href: '/admin/team', current: pathname === '/admin/team' }
    ] : []),
    ...(hasValidRole && isHydrated ? [
      { name: 'Produits', href: '/admin/products', current: pathname === '/admin/products' },
      { name: 'Témoignages', href: '/admin/testimonials', current: pathname === '/admin/testimonials' },
      { name: 'Utilisateurs', href: '/admin/users', current: pathname === '/admin/users' },
      { name: 'Paramètres', href: '/admin/settings', current: pathname === '/admin/settings' }
    ] : [])
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`border-b shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/images/lightlogo2.png"
                  alt="BM Agency Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${item.current
                      ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {user?.name || 'Utilisateur'}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

// Wrapper component with ThemeProvider
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminLayoutContent>{children}</AdminLayoutContent>
  )
}
