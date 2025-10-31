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
    const pendingItems = [
      {
        _id: '1',
        type: 'article',
        title: 'Nouvel article sur le marketing digital',
        excerpt: 'Découvrez les dernières tendances en matière de marketing digital...',
        author: {
          name: session.user?.name || 'Éditeur',
          email: session.user?.email || ''
        },
        category: 'Marketing',
        tags: ['marketing', 'digital'],
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        type: 'service',
        title: 'Nouveau service de développement web',
        excerpt: 'Nous proposons désormais des services de développement web sur mesure...',
        author: {
          name: session.user?.name || 'Éditeur',
          email: session.user?.email || ''
        },
        category: 'Développement',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    return NextResponse.json({ data: pendingItems });
  } catch (error) {
    console.error('Error fetching pending items:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des éléments en attente' },
      { status: 500 }
    );
  }
}
