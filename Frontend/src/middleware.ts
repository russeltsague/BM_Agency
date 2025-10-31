import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

const publicFile = /\..+$|\.(json|xml|txt|ico|png|jpg|jpeg|svg|webp|gif|css|js)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip public files
  if (publicFile.test(pathname)) {
    return NextResponse.next();
  }

  // Check if the path starts with /admin
  if (pathname.startsWith('/admin')) {
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Check if the path starts with a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to the default locale (French) if no locale is specified
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
