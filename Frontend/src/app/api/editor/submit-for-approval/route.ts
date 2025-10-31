import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In a real app, you would store these in a database
const pendingApprovals: any[] = [];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { type, action, data, note } = await request.json();
    
    if (!type || !action || !data) {
      return NextResponse.json(
        { error: 'Type, action et données sont requis' },
        { status: 400 }
      );
    }

    // In a real app, you would save this to a database
    const approvalRequest = {
      id: `req_${Date.now()}`,
      type,
      action,
      data,
      note,
      status: 'pending',
      submittedBy: {
        id: session.user?.id,
        name: session.user?.name,
        email: session.user?.email
      },
      submittedAt: new Date().toISOString()
    };

    // Add to pending approvals (in-memory, replace with database in production)
    pendingApprovals.push(approvalRequest);

    // In a real app, you might want to:
    // 1. Save to a database
    // 2. Send notifications to admins
    // 3. Log the action

    return NextResponse.json({
      success: true,
      message: 'Demande soumise avec succès pour approbation',
      data: approvalRequest
    });

  } catch (error) {
    console.error('Error submitting for approval:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la soumission pour approbation' },
      { status: 500 }
    );
  }
}

// Helper endpoint to get all pending approvals (for admin dashboard)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // In a real app, check if user is admin
    // if (session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Accès non autorisé' },
    //     { status: 403 }
    //   );
    // }

    return NextResponse.json({ data: pendingApprovals });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des demandes en attente' },
      { status: 500 }
    );
  }
}
