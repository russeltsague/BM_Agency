import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is an admin route (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Get token from cookie or check if it exists in localStorage (client-side)
    // Since middleware runs on server, we'll check for a cookie
    const token = request.cookies.get('admin-token')?.value

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin-token')?.value
    if (token) {
      const dashboardUrl = new URL('/admin/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
