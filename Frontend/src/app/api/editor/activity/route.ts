import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Opt out of static generation
// This is needed because we're using getServerSession
// which requires access to the request headers
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // In a real app, you would fetch this from your database
    // This is a simplified example
    const recentActivity = [
      {
        id: '1',
        type: 'article',
        title: 'Nouvel article créé',
        action: 'created',
        user: session.user?.name || 'Utilisateur',
        date: new Date(Date.now() - 3600000).toISOString(),
        status: 'pending'
      },
      {
        id: '2',
        type: 'service',
        title: 'Service mis à jour',
        action: 'updated',
        user: session.user?.name || 'Utilisateur',
        date: new Date(Date.now() - 7200000).toISOString(),
        status: 'approved'
      }
    ];

    return NextResponse.json({ data: recentActivity });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des activités' },
      { status: 500 }
    );
  }
}
