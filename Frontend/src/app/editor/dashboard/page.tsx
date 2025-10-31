'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Settings,
  TrendingUp,
  Activity,
  Clock,
  Plus,
  Eye,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  Edit3,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Package,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTheme } from '@/components/ThemeProvider';
import { servicesAPI, articlesAPI, realisationsAPI, teamAPI, testimonialsAPI, productsAPI, usersAPI } from '@/lib/api';

interface DashboardStats {
  services: number;
  portfolio: number;
  articles: number;
  team: number;
  testimonials: number;
  products: number;
  users: number;
  recentActivity: any[];
  pendingPosts: any[];
}

interface PendingPost {
  _id: string;
  title: string;
  excerpt?: string;
  author: string | { name: string; email: string };
  category?: string;
  tags?: string[];
  status: 'pending' | 'approved' | 'rejected';
  type: 'article' | 'service' | 'portfolio' | 'testimonial' | 'product' | 'team';
}

export default function EditorDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    type: string;
    action: 'create' | 'update' | 'delete';
    data: any;
  } | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submissionNote, setSubmissionNote] = useState('');

  // Fetch dashboard data
  const { data: stats, isLoading, error, refetch } = useQuery<DashboardStats>({
    queryKey: ['editorDashboardStats', refreshKey],
    queryFn: async () => {
      const [
        servicesRes,
        portfolioRes,
        articlesRes,
        teamRes,
        testimonialsRes,
        productsRes,
        usersRes,
        activityRes,
        pendingRes
      ] = await Promise.all([
        servicesAPI.getAll(),
        realisationsAPI.getAll(),
        articlesAPI.getAll(),
        teamAPI.getAll(),
        testimonialsAPI.getAll(),
        productsAPI.getAll(),
        usersAPI.getAll(),
        // Add your activity and pending endpoints here
        fetch('/api/editor/activity').then(res => res.json()),
        fetch('/api/editor/pending').then(res => res.json())
      ]);

      // Handle API responses that might have a 'data' property
      const getDataLength = (res: any) => {
        return Array.isArray(res) ? res.length : (Array.isArray(res?.data) ? res.data.length : 0);
      };

      return {
        services: getDataLength(servicesRes),
        portfolio: getDataLength(portfolioRes),
        articles: getDataLength(articlesRes),
        team: getDataLength(teamRes),
        testimonials: getDataLength(testimonialsRes),
        products: getDataLength(productsRes),
        users: getDataLength(usersRes),
        recentActivity: Array.isArray(activityRes?.data) ? activityRes.data : [],
        pendingPosts: Array.isArray(pendingRes?.data) ? pendingRes.data : []
      };
    }
  });

  // Handle action submission for approval
  const submitForApproval = useMutation({
    mutationFn: async (data: {
      type: string;
      action: string;
      data: any;
      note: string;
    }) => {
      const response = await fetch('/api/editor/submit-for-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit for approval');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Action submitted for admin approval');
      setShowSubmitDialog(false);
      setPendingAction(null);
      setSubmissionNote('');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit for approval');
    }
  });

  // Handle action submission
  const handleSubmitAction = () => {
    if (!pendingAction) return;
    
    submitForApproval.mutate({
      type: pendingAction.type,
      action: pendingAction.action,
      data: pendingAction.data,
      note: submissionNote
    });
  };

  // Wrapper function for actions that require approval
  const withApproval = (action: () => void, type: string, actionType: 'create' | 'update' | 'delete', data: any) => {
    if (user?.roles?.includes('admin')) {
      // If user is admin, perform action directly
      action();
    } else {
      // For editors, require approval
      setPendingAction({
        id: data.id || 'new',
        type,
        action: actionType,
        data
      });
      setShowSubmitDialog(true);
    }
  };

  // Example of how to use the withApproval wrapper
  const handleCreateArticle = (articleData: any) => {
    withApproval(
      () => {
        // Direct action for admins
        // Your create article logic here
        console.log('Creating article directly (admin)');
      },
      'article',
      'create',
      articleData
    );
  };

  const handleUpdateArticle = (id: string, articleData: any) => {
    withApproval(
      () => {
        // Direct action for admins
        // Your update article logic here
        console.log('Updating article directly (admin)');
      },
      'article',
      'update',
      { id, ...articleData }
    );
  };

  const handleDeleteArticle = (id: string) => {
    withApproval(
      () => {
        // Direct action for admins
        // Your delete article logic here
        console.log('Deleting article directly (admin)');
      },
      'article',
      'delete',
      { id }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading dashboard: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord Éditeur</h1>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.articles || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingPosts?.filter((p: any) => p.type === 'article').length || 0} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.services || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingPosts?.filter((p: any) => p.type === 'service').length || 0} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.portfolio || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingPosts?.filter((p: any) => p.type === 'portfolio').length || 0} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Témoignages</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.testimonials || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingPosts?.filter((p: any) => p.type === 'testimonial').length || 0} en attente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Les dernières actions effectuées sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentActivity?.length ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-md bg-primary/10">
                      {activity.type === 'article' && <FileText className="h-5 w-5 text-primary" />}
                      {activity.type === 'service' && <Briefcase className="h-5 w-5 text-primary" />}
                      {activity.type === 'testimonial' && <Star className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.action} par {activity.user} • {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={activity.status === 'approved' ? 'default' : 'secondary'}>
                    {activity.status === 'pending' ? 'En attente' : 'Approuvé'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">Aucune activité récente</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>En attente d'approbation</CardTitle>
              <CardDescription>Actions nécessitant une validation de l'administrateur</CardDescription>
            </div>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400">
              {stats?.pendingPosts?.length || 0} en attente
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {stats?.pendingPosts?.length ? (
            <div className="space-y-4">
              {stats.pendingPosts.map((post: PendingPost) => (
                <div key={post._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {post.type === 'article' && <FileText className="h-4 w-4" />}
                        {post.type === 'service' && <Briefcase className="h-4 w-4" />}
                        {post.type === 'testimonial' && <Star className="h-4 w-4" />}
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {post.excerpt.length > 100 ? `${post.excerpt.substring(0, 100)}...` : post.excerpt}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {post.type}
                        </Badge>
                        {post.category && (
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit3 className="h-4 w-4" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium mb-1">Rien en attente</h3>
              <p className="text-muted-foreground text-sm">Toutes les actions ont été traitées</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit for Approval Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <DialogTitle>Nécessite une approbation</DialogTitle>
            </div>
            <DialogDescription>
              Cette action nécessite l'approbation d'un administrateur. Voulez-vous soumettre cette demande ?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-md">
              <h4 className="font-medium mb-2">Détails de l'action</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Type:</div>
                <div className="font-medium capitalize">{pendingAction?.type}</div>
                
                <div className="text-muted-foreground">Action:</div>
                <div className="font-medium capitalize">
                  {pendingAction?.action === 'create' ? 'Création' : 
                   pendingAction?.action === 'update' ? 'Mise à jour' : 'Suppression'}
                </div>
                
                <div className="text-muted-foreground">ID:</div>
                <div className="font-mono text-sm">{pendingAction?.id}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Note pour l'administrateur (optionnel)
              </label>
              <textarea
                id="note"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Décrivez les modifications apportées..."
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowSubmitDialog(false);
                setPendingAction(null);
                setSubmissionNote('');
              }}
              disabled={submitForApproval.isPending}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitAction}
              disabled={submitForApproval.isPending}
            >
              {submitForApproval.isPending ? 'Soumission...' : 'Soumettre pour approbation'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
