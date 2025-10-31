import { NextResponse } from 'next/server';

// List of paths that should use dynamic rendering
const dynamicPaths = [
  // API routes
  '/api/*',
  
  // Admin routes
  '/admin',
  '/admin/*',
  
  // Editor routes
  '/editor',
  '/editor/*',
  
  // Internationalization routes
  '/fr',
  '/fr/*',
  '/en',
  '/en/*',
  
  // Homepage and root
  '/',
  
  // Authentication routes
  '/auth/*',
  '/login',
  '/register',
  
  // Any other dynamic content
  '/*/edit',
  '/*/create',
  '/*/update',
  '/*/delete'

// This function checks if a route should use dynamic rendering
function shouldUseDynamicRendering(pathname) {
  if (!pathname) return false;
  
  // Remove query parameters and trailing slashes
  const path = pathname.split('?')[0].replace(/\/+$/, '');
  
  // Check if path matches any dynamic path pattern
  return dynamicPaths.some(route => {
    // Convert route pattern to regex
    const pattern = route
      .replace(/\*\*/g, '.*') // Handle ** wildcard
      .replace(/\*/g, '[^/]*')  // Handle * wildcard
      .replace(/\//g, '\\/');   // Escape slashes
      
    const regex = new RegExp(`^${pattern}(?:\/|$)`);
    return regex.test(path);
  });
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Check if the route should use dynamic rendering
  if (shouldUseDynamicRendering(pathname)) {
    // Force dynamic rendering by setting the x-middleware-cache header
    const response = NextResponse.next();
    
    // Add headers to prevent static optimization
    response.headers.set('x-middleware-cache', 'no-cache');
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|static|favicon.ico|public/).*)',
  ],
};
