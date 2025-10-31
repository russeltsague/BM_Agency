import { HomeContent } from './HomeContent';

// This is a server component that handles static generation
export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <HomeContent locale={locale} />;
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

// Enable static rendering for better performance
export const dynamic = 'force-static';
