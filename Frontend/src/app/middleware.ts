import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

export const locales = ['en', 'fr'] as const;
export const defaultLocale = 'fr';

export const publicPaths = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/images',
  '/robots.txt',
  '/sitemap.xml',
];

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
});

// Main middleware function
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public files and API routes
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Handle root path - redirect to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Check if the path has a valid locale
  const pathnameHasLocale = locales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // Redirect to the same path with default locale if no locale is present
  if (!pathnameHasLocale) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }
  if (pathname === '/') {
    const url = new URL(`/${defaultLocale}/`, request.url);
    return NextResponse.redirect(url);
  }
  
  // If the pathname already has a locale, let next-intl handle it
  if (pathnameHasLocale) {
    // Ensure the path ends with a trailing slash for consistency
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 1 && !pathname.endsWith('/')) {
      const url = new URL(pathname + '/', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  // Let next-intl handle the request
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for the ones starting with:
    '/((?!api|_next/static|_next/image|favicon.ico|images/|sw.js|robots.txt|sitemap.xml|_next/webpack-hmr|.*\\.).*)',
    // Match all pathnames within the locale group
    '/(en|fr)/:path*',
  ],
};
