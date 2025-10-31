'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Eye, Trash2, Clock, CheckCircle, XCircle, FileText } from 'lucide-react'
import Link from 'next/link'

interface Article {
  _id: string
  title: string
  status: string
  author: string
  createdAt: string
  updatedAt: string
  published?: boolean
}

export default function MyArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/v1/articles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      })
      const data = await response.json()

      if (data.status === 'success') {
        // Filter articles by current user as author
        const myArticles = data.data.filter((article: Article) =>
          article.author === user?.id
        )
        setArticles(myArticles)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending_approval':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Eye className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'draft': { variant: 'secondary' as const, text: 'Brouillon' },
      'pending_approval': { variant: 'default' as const, text: 'En attente' },
      'published': { variant: 'default' as const, text: 'Publié' },
      'rejected': { variant: 'destructive' as const, text: 'Refusé' },
      'archived': { variant: 'outline' as const, text: 'Archivé' }
    }

    const config = statusMap[status as keyof typeof statusMap] || statusMap.draft

    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes Articles</h1>
          <p className="text-slate-400">Gérez vos articles et leur statut de publication</p>
        </div>
        <Link href="/admin/blog">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Edit className="mr-2 h-4 w-4" />
            Nouvel Article
          </Button>
        </Link>
      </div>

      {articles.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Aucun article trouvé</h3>
            <p className="text-slate-400 mb-4">Vous n'avez pas encore créé d'articles.</p>
            <Link href="/admin/blog">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Créer votre premier article
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Card key={article._id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white">{article.title}</CardTitle>
                    <CardDescription className="text-slate-400 mt-2">
                      Créé le {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                      {article.updatedAt !== article.createdAt && (
                        <> • Modifié le {new Date(article.updatedAt).toLocaleDateString('fr-FR')}</>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(article.status)}
                    {getStatusBadge(article.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Statut: {article.status === 'published' ? 'Publié' :
                           article.status === 'pending_approval' ? 'En attente d\'approbation' :
                           article.status === 'rejected' ? 'Refusé' : 'Brouillon'}
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/admin/blog/${article._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Button>
                    </Link>
                    <Link href={`/admin/blog/${article._id}/edit`}>
                      <Button size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
