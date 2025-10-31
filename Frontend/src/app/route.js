// This file forces all routes to be dynamic
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  return children;
}
