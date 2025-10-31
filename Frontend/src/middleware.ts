import { NextRequest, NextResponse } from 'next/server';
import { locales } from './i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path starts with /admin
  if (pathname.startsWith('/admin')) {
    // Default to 'fr' if no locale is provided
    const defaultLocale = 'fr';
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    '/admin/:path*',
  ],
};
