'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!token || !user)) {
      router.push('/admin/login')
    }
  }, [user, token, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!token || !user) {
    return null
  }

  return <>{children}</>
}
