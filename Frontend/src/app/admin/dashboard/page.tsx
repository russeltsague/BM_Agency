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
  Package
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
  services: number
  portfolio: number
  articles: number
  team: number
  testimonials: number
  products: number
  users: number
  recentActivity: any[]
  pendingPosts: any[]
}

interface PendingPost {
  _id: string
  title: string
  excerpt?: string
  author: string | { name: string; email: string }
  category?: string
  tags?: string[]
  status: 'pending' | 'approved' | 'rejected'
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);

  // Approval mutations
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return articlesAPI.approve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article approuvé avec succès!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de l\'approbation');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      return articlesAPI.reject(id, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article rejeté');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du rejet');
    },
  });

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: string, reason?: string) => {
    rejectMutation.mutate({ id, reason });
  };

  // Manual refresh function
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    queryClient.invalidateQueries({ 
      queryKey: ['services', 'portfolio', 'articles', 'team', 'testimonials', 'products', 'users'] 
    });
    toast.success('Actualisation des données...');
  };

  // Check user permissions safely
  const isAdmin = user?.roles?.includes('admin') ?? false;
  const isEditor = user?.roles?.includes('editor') ?? false;
  
  // Get user permissions with defaults
  const userPermissions = user?.adminPermissions || {
    services: isAdmin,
    portfolio: isAdmin,
    blog: isAdmin || isEditor,
    team: isAdmin,
    testimonials: isAdmin,
    products: isAdmin,
    users: isAdmin,
    settings: isAdmin,
    analytics: isAdmin
  };
  
  // Fetch dashboard stats based on user role and permissions
  const { data: servicesData } = useQuery({
    queryKey: ['services', refreshKey],
    queryFn: servicesAPI.getAll,
    enabled: !!user && userPermissions.services
  });

  const { data: portfolioData } = useQuery({
    queryKey: ['portfolio', refreshKey],
    queryFn: realisationsAPI.getAll,
    enabled: !!user && userPermissions.portfolio
  });

  // For editors, only fetch their own articles
  const { data: articlesData } = useQuery({
    queryKey: ['articles', refreshKey, user?._id],
    queryFn: () => isEditor && user?._id
      ? articlesAPI.getByAuthor(user._id) 
      : articlesAPI.getAll(),
    enabled: !!user && userPermissions.blog
  });

  const { data: teamData } = useQuery({
    queryKey: ['team', refreshKey],
    queryFn: teamAPI.getAll,
    enabled: !!user && userPermissions.team
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials', refreshKey],
    queryFn: testimonialsAPI.getAll,
    enabled: !!user && userPermissions.testimonials
  });

  const { data: productsData } = useQuery({
    queryKey: ['products', refreshKey],
    queryFn: productsAPI.getAll,
    enabled: !!user && userPermissions.products
  });

  // Only admins can fetch users list
  const { data: usersData } = useQuery({
    queryKey: ['users', refreshKey],
    queryFn: usersAPI.getAll,
    enabled: !!user && isAdmin
  });

  // Compute stats based on API data and user permissions
  const stats: DashboardStats = React.useMemo(() => {
    // Helper function to safely get array length with fallback
    const getCount = (data: any, hasPermission: boolean | undefined) => {
      if (hasPermission === undefined || !hasPermission) return 0;
      return Array.isArray(data?.data) ? data.data.length : 0;
    };

    return {
      services: getCount(servicesData, userPermissions.services),
      portfolio: getCount(portfolioData, userPermissions.portfolio),
      articles: getCount(articlesData, userPermissions.blog),
      team: getCount(teamData, userPermissions.team),
      testimonials: getCount(testimonialsData, userPermissions.testimonials),
      products: getCount(productsData, userPermissions.products),
      users: isAdmin ? (usersData?.data?.users?.length || 0) : 0,
      pendingPosts: Array.isArray(articlesData?.data)
        ? articlesData.data.filter((article: any) => !article.published && article.status === 'pending')
        : [],
      recentActivity: [
        ...(Array.isArray(articlesData?.data)
          ? articlesData.data.slice(0, 3).map((article: any) => ({
              type: 'article',
              title: article.title,
              date: new Date(article.createdAt).toLocaleDateString(),
              icon: FileText
            }))
          : []
        ),
        ...(Array.isArray(portfolioData?.data)
          ? portfolioData.data.slice(0, 2).map((project: any) => ({
              type: 'portfolio',
              title: project.title,
              date: new Date(project.createdAt).toLocaleDateString(),
              icon: Briefcase
            }))
          : []
        )
      ]
    };
  }, [servicesData, portfolioData, articlesData, teamData, testimonialsData, productsData, usersData, user, userPermissions, isAdmin]);


  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`p-8 rounded-xl shadow-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p>Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    )
  }

  // Check if user has valid roles (after user is loaded)
  console.log('Dashboard - Checking user roles:', user.roles);
  
  // Normalize roles to lowercase for case-insensitive comparison
  const userRoles = Array.isArray(user.roles) 
    ? user.roles.map(role => role.toLowerCase())
    : [];
  
  // Expanded list of valid admin roles (matching admin layout)
  const validRoles = [
    'admin', 'administrator', 'superadmin', 'super_admin', 'super admin',
    'owner', 'editor', 'moderator', 'manager', 'author'
  ];
  
  // Check if any of the user's roles match the valid roles (case-insensitive)
  const hasValidRole = userRoles.some(role => 
    validRoles.some(validRole => 
      role.toLowerCase().includes(validRole.toLowerCase())
    )
  );

  console.log('Dashboard - Normalized user roles:', userRoles);
  console.log('Dashboard - Has valid role:', hasValidRole);

  if (!hasValidRole) {
    console.log('Dashboard - No valid roles found in loading check, redirecting to login')
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`p-8 rounded-xl shadow-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p>Redirection vers la page de connexion...</p>
          </div>
        </div>
      </div>
    )
  }

  const quickActions = [
    { name: 'Nouvel Article', href: '/admin/blog', icon: FileText, color: 'bg-purple-500 hover:bg-purple-600' },
    ...(hasValidRole && user.roles.some(role => ['admin', 'owner', 'editor'].includes(role.toLowerCase())) ? [
      { name: 'Nouveau Service', href: '/admin/services', icon: Plus, color: 'bg-blue-500 hover:bg-blue-600' },
      { name: 'Nouveau Projet', href: '/admin/portfolio', icon: Briefcase, color: 'bg-green-500 hover:bg-green-600' },
      { name: 'Nouveau Membre', href: '/admin/team', icon: Users, color: 'bg-orange-500 hover:bg-orange-600' }
    ] : []),
    ...(hasValidRole && user.roles.some(role => ['admin', 'owner'].includes(role.toLowerCase())) ? [
      { name: 'Nouvel Utilisateur', href: '/admin/users', icon: Users, color: 'bg-indigo-500 hover:bg-indigo-600' }
    ] : [])
  ]

  const statsCards = [
    {
      title: 'Articles',
      value: stats.articles,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      href: '/admin/blog'
    },
    ...(hasValidRole && user.roles.some(role => ['admin', 'owner', 'editor'].includes(role.toLowerCase())) ? [
      {
        title: 'Services',
        value: stats.services,
        icon: Settings,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        href: '/admin/services'
      },
      {
        title: 'Portfolio',
        value: stats.portfolio,
        icon: Briefcase,
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        iconColor: 'text-green-600 dark:text-green-400',
        href: '/admin/portfolio'
      },
      {
        title: 'Équipe',
        value: stats.team,
        icon: Users,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        iconColor: 'text-orange-600 dark:text-orange-400',
        href: '/admin/team'
      }
    ] : []),
    ...(hasValidRole ? [
      {
        title: 'Utilisateurs',
        value: stats.users,
        icon: Users,
        color: 'from-indigo-500 to-indigo-600',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        href: '/admin/users'
      }
    ] : []),
    ...(hasValidRole && user.roles.some(role => ['admin', 'owner'].includes(role.toLowerCase())) ? [
      {
        title: 'En Attente',
        value: stats.pendingPosts.length,
        icon: AlertCircle,
        color: 'from-red-500 to-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        iconColor: 'text-red-600 dark:text-red-400',
        href: '/admin/blog?filter=pending'
      }
    ] : [])
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-300 ${theme === 'dark' ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-white/80'} backdrop-blur-sm sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <LayoutDashboard className="h-6 w-6 text-blue-500" />
                <span>Tableau de Bord</span>
              </h1>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Bienvenue, {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className={`${theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}>
                {user.roles.join(', ')}
              </Badge>
              <Button
                onClick={logout}
                variant="destructive"
                size="sm"
                className="shadow-sm"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-gray-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200'}`}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Vue d'ensemble
                </CardTitle>
              </div>
              <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Aperçu complet de votre système - utilisateurs, équipe et performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid grid-cols-1 md:grid-cols-2 ${statsCards.length >= 6 ? 'lg:grid-cols-3 xl:grid-cols-6' : statsCards.length >= 4 ? 'lg:grid-cols-4 xl:grid-cols-4' : 'lg:grid-cols-3 xl:grid-cols-3'} gap-6`}>
                {statsCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => router.push(stat.href)}
                      className={`w-full text-left transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-opacity-50 cursor-pointer ${theme === 'dark' ? 'hover:ring-gray-600 focus:ring-gray-600' : 'hover:ring-gray-300 focus:ring-gray-300'} focus:outline-none rounded-lg`}
                      aria-label={`Accéder à la gestion des ${stat.title.toLowerCase()}`}
                    >
                      <Card className={`transition-all duration-300 hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {stat.title}
                              </p>
                              <p className="text-3xl font-bold mt-2">
                                {stat.value}
                              </p>
                              <p className={`text-xs mt-1 opacity-75 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                Cliquer pour gérer
                              </p>
                            </div>
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} ${stat.bgColor} flex items-center justify-center`}>
                              <div className="flex flex-col items-center">
                                <stat.icon className={`h-6 w-6 ${stat.iconColor} mb-1`} />
                                <ArrowRight className={`h-3 w-3 ${stat.iconColor} opacity-75`} />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-500" />
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Actions Rapides
                </CardTitle>
              </div>
              <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Créez du contenu rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => router.push(action.href)}
                      className={`w-full h-20 flex flex-col items-center justify-center space-y-2 ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                    >
                      <action.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{action.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Approvals */}
        {hasValidRole && user.roles.some(role => ['admin', 'owner'].includes(role.toLowerCase())) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={() => router.push('/admin/blog?filter=pending')}
              className={`w-full text-left transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-opacity-50 cursor-pointer ${theme === 'dark' ? 'hover:ring-gray-600 focus:ring-gray-600' : 'hover:ring-gray-300 focus:ring-gray-300'} focus:outline-none rounded-lg`}
              aria-label="Accéder aux articles en attente d'approbation"
            >
              <Card className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-700/50 hover:bg-orange-900/30' : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:bg-orange-100'}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-6 w-6 text-orange-500" />
                      <CardTitle className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Approbations en Attente ({stats.pendingPosts.length})
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                        Action Requise
                      </span>
                      <ArrowRight className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-transform duration-200 hover:translate-x-1`} />
                    </div>
                  </div>
                  <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Articles soumis par les éditeurs nécessitant une approbation administrative
                  </CardDescription>
                </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.pendingPosts.length > 0 ? (
                    stats.pendingPosts.slice(0, 5).map((post: any, index: number) => (
                      <div key={post._id} className={`border rounded-lg p-5 transition-all duration-200 ${theme === 'dark' ? 'border-orange-700/50 hover:bg-orange-900/10 hover:border-orange-600/50' : 'border-orange-200 hover:bg-orange-50 hover:border-orange-300'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {post.title}
                            </h4>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {post.excerpt || 'Aucun extrait disponible'}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className={`text-xs ${theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}>
                                {typeof post.author === 'object' ? post.author.name : post.author}
                              </Badge>
                              {post.category && (
                                <Badge variant="secondary" className={`text-xs ${theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'}`}>
                                  {post.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-red-900/30 text-red-400 border border-red-700/50' : 'bg-red-100 text-red-700 border border-red-300'} animate-pulse`}>
                            🔴 En Attente d'Approbation
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 mt-4">
                          <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Actions disponibles:
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className={`text-xs ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Aperçu
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleApprove(post._id)}
                            disabled={approveMutation.isPending}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {approveMutation.isPending ? 'Approbation...' : 'Approuver'}
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(post._id)}
                            disabled={rejectMutation.isPending}
                            className="text-xs font-medium px-3 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {rejectMutation.isPending ? 'Rejet...' : 'Rejeter'}
                          </Button>
                        </div>

                        <div className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          Soumis le {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <CheckCircle className={`h-12 w-12 mx-auto mb-3 ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`} />
                      <p className="text-sm font-medium">Aucune approbation en attente</p>
                      <p className="text-xs mt-1">Tous les articles ont été examinés ✅</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </button>
        </motion.div>
      )}

        {/* User Information */}
        {hasValidRole && user.roles.some(role => ['admin', 'owner', 'editor'].includes(role.toLowerCase())) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {user.roles.some(role => ['admin', 'owner'].includes(role.toLowerCase())) ? (
              <button
                onClick={() => router.push('/admin/users')}
                className={`w-full text-left transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-opacity-50 cursor-pointer ${theme === 'dark' ? 'hover:ring-gray-600 focus:ring-gray-600' : 'hover:ring-gray-300 focus:ring-gray-300'} focus:outline-none rounded-lg`}
                aria-label="Accéder à la gestion des utilisateurs"
              >
                <Card className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                          Informations Utilisateur
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          Gérer les utilisateurs
                        </span>
                        <ArrowRight className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-transform duration-200 hover:translate-x-1`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'}`}>
                          <Users className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {user.name}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                          <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Rôles
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.roles.map((role: string) => (
                              <Badge key={role} variant="outline" className={theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'}>
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                          <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Permissions
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {(user as any).adminPermissions && Object.entries((user as any).adminPermissions).map(([key, value]) => (
                              value && (
                                <div key={key} className="flex items-center space-x-1">
                                  <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'}`}></div>
                                  <span className={`text-xs capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {key}
                                  </span>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ) : (
              <Card className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-gray-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200'}`}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      Informations Utilisateur
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'}`}>
                        <Users className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {user.name}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Rédacteur - {user.email}
                        </p>
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Rôles
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.roles.map((role: string) => (
                          <Badge key={role} variant="outline" className={theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'}>
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Editor Welcome Message */}
        {hasValidRole && !user.roles.some(role => ['admin', 'owner'].includes(role.toLowerCase())) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-gray-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200'}`}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    Bienvenue dans votre espace de gestion
                  </CardTitle>
                </div>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Gérez vos articles, services et projets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100'}`}>
                      <FileText className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <div>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Rédacteur - {user.email}
                      </p>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Rôles et Permissions
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.roles.map((role: string) => (
                        <Badge key={role} variant="outline" className={theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'}>
                          {role}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'}`}></div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Gestion des articles
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Gestion des services
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'}`}></div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Gestion du portfolio
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-orange-400' : 'bg-orange-500'}`}></div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Gestion de l'équipe
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
