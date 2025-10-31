import { Request } from 'express';
import en from './locales/en.json';
import fr from './locales/fr.json';

export type Language = 'en' | 'fr';
export type TranslationKey = string;

interface Translations {
  [key: string]: any;
}

const translations: Record<Language, Translations> = {
  en,
  fr
};

/**
 * Get nested translation value from object using dot notation
 * Example: 'auth.login_success' => translations.auth.login_success
 */
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Translate a key for a given language
 * @param key - Translation key in dot notation (e.g., 'auth.login_success')
 * @param lang - Language code ('en' or 'fr')
 * @param params - Optional parameters for string interpolation
 */
export function t(key: TranslationKey, lang: Language = 'en', params?: Record<string, string | number>): string {
  const translation = getNestedValue(translations[lang], key);
  
  if (!translation) {
    // Fallback to English if translation not found
    const fallback = getNestedValue(translations.en, key);
    if (!fallback) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return fallback;
  }

  // Replace parameters if provided
  if (params) {
    return Object.entries(params).reduce(
      (str, [param, value]) => str.replace(new RegExp(`{{${param}}}`, 'g'), String(value)),
      translation
    );
  }

  return translation;
}

/**
 * Get language from request headers or default to English
 * Checks Accept-Language header and custom x-language header
 */
export function getLanguageFromRequest(req: Request): Language {
  // Check custom header first
  const customLang = req.headers['x-language'] as string;
  if (customLang === 'fr' || customLang === 'en') {
    return customLang;
  }

  // Check Accept-Language header
  const acceptLang = req.headers['accept-language'];
  if (acceptLang) {
    const lang = acceptLang.split(',')[0].split('-')[0].toLowerCase();
    if (lang === 'fr') return 'fr';
  }

  // Check query parameter
  const queryLang = req.query.lang as string;
  if (queryLang === 'fr' || queryLang === 'en') {
    return queryLang;
  }

  return 'en'; // Default to English
}

/**
 * Middleware to attach translation function to request
 */
export function i18nMiddleware(req: Request, res: any, next: any) {
  const lang = getLanguageFromRequest(req);
  
  // Attach translation function to request
  (req as any).t = (key: TranslationKey, params?: Record<string, string | number>) => t(key, lang, params);
  (req as any).lang = lang;
  
  next();
}

export default { t, getLanguageFromRequest, i18nMiddleware };
