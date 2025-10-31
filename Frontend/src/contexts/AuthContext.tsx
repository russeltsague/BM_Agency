'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  _id: string
  id: string
  email: string
  name: string
  roles: string[]
  adminPermissions?: {
    services?: boolean;
    portfolio?: boolean;
    blog?: boolean;
    team?: boolean;
    testimonials?: boolean;
    products?: boolean;
    users?: boolean;
    settings?: boolean;
    analytics?: boolean;
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isHydrated: boolean
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState<boolean>(false)
  const router = useRouter()

  // Prevent hydration mismatch by waiting for client-side hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Check for existing token on mount (only after hydration)
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      console.log('AuthContext - Hydrated, checking for existing token')
      const token = localStorage.getItem('admin-token')
      const storedUser = localStorage.getItem('admin-user')
      console.log('AuthContext - Token found:', token)
      console.log('AuthContext - Stored user found:', storedUser)

      if (token && storedUser) {
        // Check if this is a demo token or real token
        if (token.startsWith('demo-token-')) {
          console.log('AuthContext - Demo token detected, loading from localStorage directly')
          try {
            const userData = JSON.parse(storedUser)
            // Ensure _id is set, fallback to id if _id doesn't exist
            const userWithId = {
              ...userData,
              _id: userData._id || userData.id
            }
            setUser(userWithId)
          } catch (error) {
            console.error('AuthContext - Error parsing demo user data:', error)
            localStorage.removeItem('admin-token')
            localStorage.removeItem('admin-user')
          }
        } else {
          console.log('AuthContext - Real token detected, verifying with backend')
          fetchUserProfile()
        }
      } else {
        console.log('AuthContext - No token or user found')
      }
    }
  }, [isHydrated])

  const fetchUserProfile = async () => {
    if (!isHydrated) return

    console.log('AuthContext - fetchUserProfile called')

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('AuthContext - Backend response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('AuthContext - Backend response data:', data)
        if (data.status === 'success') {
          setUser({
            _id: data.data.user._id,
            id: data.data.user._id,
            email: data.data.user.email,
            name: data.data.user.name,
            roles: data.data.user.roles || ['editor'], // Fallback to editor if no roles
            adminPermissions: {
              services: true,
              portfolio: true,
              blog: true,
              team: true,
              testimonials: true,
              products: true,
              users: (data.data.user.roles || []).includes('admin'),
              settings: (data.data.user.roles || []).includes('admin'),
              analytics: true
            }
          })
          console.log('AuthContext - User set from backend:', data.data.user)
        }
      } else {
        console.log('AuthContext - Backend call failed, trying localStorage fallback')
        // Token is invalid, but try to restore from localStorage as fallback
        const storedUser = localStorage.getItem('admin-user')
        console.log('AuthContext - Stored user from localStorage (fallback):', storedUser)
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            console.log('AuthContext - Parsed user data (fallback):', userData)
            setUser(userData)
            return // Successfully restored from localStorage
          } catch (parseError) {
            console.error('AuthContext - Error parsing stored user (fallback):', parseError)
            localStorage.removeItem('admin-token')
            localStorage.removeItem('admin-user')
          }
        }
      }
    } catch (error) {
      console.error('AuthContext - Error fetching user profile:', error)
      console.log('AuthContext - Trying localStorage fallback due to error')
      // Try to restore from localStorage as fallback
      const storedUser = localStorage.getItem('admin-user')
      console.log('AuthContext - Stored user from localStorage:', storedUser)
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          console.log('AuthContext - Parsed user data:', userData)
          setUser(userData)
        } catch (parseError) {
          console.error('AuthContext - Error parsing stored user:', parseError)
          localStorage.removeItem('admin-token')
          localStorage.removeItem('admin-user')
        }
      }
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login - Starting login process for email:', email);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const { token, user: userData } = data
        
        // Ensure we have the required user data
        if (!userData) {
          throw new Error('No user data received')
        }
        
        console.log('Login - User data received:', JSON.stringify(userData, null, 2));
        console.log('Login - User roles:', userData.roles);
        
        // Store token and user data
        localStorage.setItem('admin-token', token)
        
        // Ensure user object has _id and adminPermissions with default values
        const userWithPermissions = {
          ...userData,
          _id: userData._id || userData.id,
          adminPermissions: userData.adminPermissions || {
            services: true,
            portfolio: true,
            blog: true,
            team: true,
            testimonials: true,
            products: true,
            users: userData.roles?.some((role: string) => ['admin', 'owner', 'administrator'].includes(role.toLowerCase())) || false,
            settings: userData.roles?.some((role: string) => ['admin', 'owner', 'administrator'].includes(role.toLowerCase())) || false,
            analytics: true
          }
        };
        
        console.log('Login - User with permissions:', JSON.stringify(userWithPermissions, null, 2));
        
        localStorage.setItem('admin-user', JSON.stringify(userWithPermissions));
        setUser(userWithPermissions);
        return true;
      } else {
        // Fallback to demo authentication for development
        console.warn('Backend authentication failed, using demo mode')

        // Map demo emails to real MongoDB user IDs
        const demoUsers: Record<string, User> = {
          'admin@example.com': {
            id: '68ff6e60bd1290b1b3255733',
            _id: '68ff6e60bd1290b1b3255733',
            email: 'admin@example.com',
            name: 'Admin User',
            roles: ['admin'],
            adminPermissions: {
              services: true,
              portfolio: true,
              blog: true,
              team: true,
              testimonials: true,
              products: true,
              users: true,
              settings: true,
              analytics: true
            }
          },
          'owner@bmagency.com': {
            id: '68ff7b0fe19869b8b0bb223b',
            _id: '68ff7b0fe19869b8b0bb223b',
            email: 'owner@bmagency.com',
            name: 'System Owner',
            roles: ['owner'],
            adminPermissions: {
              services: true,
              portfolio: true,
              blog: true,
              team: true,
              testimonials: true,
              products: true,
              users: true,
              settings: true,
              analytics: true
            }
          },
          'editor@bmagency.com': {
            id: '68ff7b14e19869b8b0bb223e',
            _id: '68ff7b14e19869b8b0bb223e',
            email: 'editor@bmagency.com',
            name: 'Content Editor',
            roles: ['editor'],
            adminPermissions: {
              services: false,
              portfolio: false,
              blog: true,
              team: false,
              testimonials: false,
              products: false,
              users: false,
              settings: false,
              analytics: true
            }
          },
          'author@bmagency.com': {
            id: '68ff7b27e19869b8b0bb2241',
            _id: '68ff7b27e19869b8b0bb2241',
            email: 'author@bmagency.com',
            name: 'Content Author',
            roles: ['author'],
            adminPermissions: {
              services: false,
              portfolio: false,
              blog: true,
              team: false,
              testimonials: false,
              products: false,
              users: false,
              settings: false,
              analytics: false
            }
          }
        };

        const userData = demoUsers[email] || {
          id: '68ff7b14e19869b8b0bb223e',
          _id: '68ff7b14e19869b8b0bb223e',
          email: email,
          name: email.split('@')[0],
          roles: ['editor'],
          adminPermissions: {
            services: false,
            portfolio: false,
            blog: true,
            team: false,
            testimonials: false,
            products: false,
            users: false,
            settings: false,
            analytics: true
          }
        }

        // Store demo token
        localStorage.setItem('admin-token', 'demo-token-' + Date.now())
        localStorage.setItem('admin-user', JSON.stringify(userData))

        // Debug: Log the demo login
        console.log('AuthContext - Demo login successful')
        console.log('AuthContext - User data stored:', userData)
        console.log('AuthContext - Token stored:', 'demo-token-' + Date.now())

        setUser(userData)
        console.log('AuthContext - User state set in context')
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
      // Fallback to demo authentication
      console.warn('Backend unavailable, using demo mode')

      // Map demo emails to real MongoDB user IDs
      const demoUsers: Record<string, User> = {
        'admin@example.com': {
          id: '68ff6e60bd1290b1b3255733',
          _id: '68ff6e60bd1290b1b3255733',
          email: 'admin@example.com',
          name: 'Admin User',
          roles: ['admin'],
          adminPermissions: {
            services: true,
            portfolio: true,
            blog: true,
            team: true,
            testimonials: true,
            products: true,
            users: true,
            settings: true,
            analytics: true
          }
        },
        'owner@bmagency.com': {
          id: '68ff7b0fe19869b8b0bb223b',
          _id: '68ff7b0fe19869b8b0bb223b',
          email: 'owner@bmagency.com',
          name: 'System Owner',
          roles: ['owner'],
          adminPermissions: {
            services: true,
            portfolio: true,
            blog: true,
            team: true,
            testimonials: true,
            products: true,
            users: true,
            settings: true,
            analytics: true
          }
        },
        'editor@bmagency.com': {
          id: '68ff7b14e19869b8b0bb223e',
          _id: '68ff7b14e19869b8b0bb223e',
          email: 'editor@bmagency.com',
          name: 'Content Editor',
          roles: ['editor'],
          adminPermissions: {
            services: false,
            portfolio: false,
            blog: true,
            team: false,
            testimonials: false,
            products: false,
            users: false,
            settings: false,
            analytics: true
          }
        },
        'author@bmagency.com': {
          id: '68ff7b27e19869b8b0bb2241',
          _id: '68ff7b27e19869b8b0bb2241',
          email: 'author@bmagency.com',
          name: 'Content Author',
          roles: ['author'],
          adminPermissions: {
            services: false,
            portfolio: false,
            blog: true,
            team: false,
            testimonials: false,
            products: false,
            users: false,
            settings: false,
            analytics: false
          }
        }
      };

      const userData = demoUsers[email] || {
        id: '68ff7b14e19869b8b0bb223e',
        _id: '68ff7b14e19869b8b0bb223e',
        email: email,
        name: email.split('@')[0],
        roles: ['editor'],
        adminPermissions: {
          services: false,
          portfolio: false,
          blog: true,
          team: false,
          testimonials: false,
          products: false,
          users: false,
          settings: false,
          analytics: true
        }
      }

      localStorage.setItem('admin-token', 'demo-token-' + Date.now())
      localStorage.setItem('admin-user', JSON.stringify(userData))

      // Debug: Log the fallback demo login
      console.log('AuthContext - Fallback demo login successful')
      console.log('AuthContext - User data stored (fallback):', userData)
      console.log('AuthContext - Token stored (fallback):', 'demo-token-' + Date.now())

      setUser(userData)
      console.log('AuthContext - User state set in context (fallback)')
      return true
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (!isHydrated) return

    setUser(null)
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-user')
    router.push('/admin/login')
  }

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isHydrated
  }

  // Prevent hydration mismatch
  if (!isHydrated) {
    return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  // During SSR, return a safe default instead of throwing an error
  if (typeof window === 'undefined') {
    console.log('useAuth - SSR detected, returning safe default');
    return {
      user: null,
      login: async () => false,
      logout: () => {},
      isLoading: false,
      isHydrated: false
    };
  }

  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
