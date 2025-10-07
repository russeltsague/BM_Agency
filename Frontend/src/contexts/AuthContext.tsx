'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, type User as APIUser } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('admin-token')
    const storedUser = localStorage.getItem('admin-user')

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(userData)
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('admin-token')
        localStorage.removeItem('admin-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      const response = await authAPI.login({ email, password })

      // Extract user data from response
      const userData = {
        id: response.data.user._id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role,
      }

      // Store token and user data
      localStorage.setItem('admin-token', response.token)
      localStorage.setItem('admin-user', JSON.stringify(userData))

      // Set cookie for server-side middleware
      if (typeof window !== 'undefined') {
        document.cookie = `admin-token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
      }

      setToken(response.token)
      setUser(userData)

      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Network error occurred' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-user')

    // Clear cookie
    if (typeof window !== 'undefined') {
      document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    }

    setToken(null)
    setUser(null)
    router.push('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
