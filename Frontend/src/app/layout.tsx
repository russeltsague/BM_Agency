import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

// Import metadata from a separate file
export { metadata } from './metadata';

// Force all pages to be dynamic
export const dynamic = 'force-dynamic';

// Disable static optimization
export const revalidate = 0;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-slate-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
