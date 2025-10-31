import { NextResponse } from 'next/server';
import { realisationsAPI } from '@/lib/api';

export async function GET() {
  try {
    const response = await realisationsAPI.getAll();
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching realisations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch realisations' },
      { status: 500 }
    );
  }
}
