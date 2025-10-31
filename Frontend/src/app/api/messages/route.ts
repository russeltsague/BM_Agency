import { NextResponse } from 'next/server';

type Locale = 'en' | 'fr';

// Helper function to load messages
async function loadMessages(locale: Locale) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    return {};
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get('locale') as Locale) || 'fr';
  
  // Validate locale
  if (!['en', 'fr'].includes(locale)) {
    return NextResponse.json(
      { error: 'Invalid locale' },
      { status: 400 }
    );
  }
  
  try {
    const messages = await loadMessages(locale);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error in messages API route:', error);
    return NextResponse.json(
      { error: 'Failed to load messages' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
