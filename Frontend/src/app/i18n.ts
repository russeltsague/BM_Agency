// Supported languages
export const locales = ['en', 'fr'] as const;

export type Locale = typeof locales[number];

// Default language
export const defaultLocale: Locale = 'fr';

// You can add more i18n configuration here if needed
