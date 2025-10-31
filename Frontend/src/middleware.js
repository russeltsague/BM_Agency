import { NextResponse } from 'next/server';

// List of paths that should use dynamic rendering
const dynamicPaths = [
  '/api/realisations',
  '/admin',
  '/admin/*',
  '/editor',
  '/editor/*',
  '/fr',
  '/en'
];

// This function checks if a route should use dynamic rendering
function shouldUseDynamicRendering(pathname) {
  if (!pathname) return false;
  
  // Remove query parameters
  const path = pathname.split('?')[0];
  
  return dynamicPaths.some(route => {
    // Convert route pattern to regex
    const pattern = route
      .replace(/\*\*/g, '.*') // Handle ** wildcard
      .replace(/\*/g, '[^/]*')  // Handle * wildcard
      .replace(/\//g, '\\/');   // Escape slashes
      
    const regex = new RegExp(`^${pattern}$`);
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
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/') // Skip API routes
  ) {
    return NextResponse.next();
  }
  
  // Check if the route should use dynamic rendering
  if (shouldUseDynamicRendering(pathname)) {
    // Force dynamic rendering by setting the x-middleware-cache header
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
