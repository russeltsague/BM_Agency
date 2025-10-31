import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define the list of supported locales
export const locales = ['en', 'fr'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'fr';

// We enumerate all dictionaries here for better linting and typescript support
const messages = {
  en: () => import('./messages/en.json').then((module) => module.default),
  fr: () => import('./messages/fr.json').then((module) => module.default),
} as const;

// Validate that the incoming `locale` parameter is valid
function isValidLocale(locale: string | undefined): locale is Locale {
  return typeof locale === 'string' && locales.includes(locale as Locale);
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!isValidLocale(locale)) {
    notFound();
  }

  try {
    // Load messages for the specified locale
    const messagesForLocale = await messages[locale as Locale]();
    
    return {
      messages: messagesForLocale,
      // You can add more i18n configuration here if needed
      defaultTranslationValues: {
        strong: (chunks: string) => `<strong>${chunks}</strong>`,
      },
      onError(error: any) {
        if (process.env.NODE_ENV === 'development') {
          console.error(error);
        }
      },
      // Add the required locale property
      locale,
    } as const;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    notFound();
  }
});
