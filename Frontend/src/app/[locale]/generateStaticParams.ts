// This file is used to generate static params for the [locale] segment
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

export const dynamicParams = false;
