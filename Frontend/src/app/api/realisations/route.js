import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // This will force this route to be server-side rendered on every request
    // and prevent static generation timeout issues
    return NextResponse.json(
      { message: 'This route is not meant to be statically generated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in realisations API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
