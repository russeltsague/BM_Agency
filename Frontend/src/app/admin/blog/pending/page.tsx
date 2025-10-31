'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Eye, Clock, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Article {
  _id: string
  title: string
  content: string
  status: string
  author: {
    name: string
    email: string
  }
  submittedAt: string
  createdAt: string
}

export default function PendingApprovalPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchPendingArticles()
  }, [])

  const fetchPendingArticles = async () => {
    try {
      const response = await fetch('/api/v1/articles/admin/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      })
      const data = await response.json()

      if (data.status === 'success') {
        setArticles(data.data)
      }
    } catch (error) {
      console.error('Error fetching pending articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (articleId: string) => {
    try {
      const response = await fetch(`/api/v1/articles/${articleId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Refresh the list
        fetchPendingArticles()
      }
    } catch (error) {
      console.error('Error approving article:', error)
    }
  }

  const handleReject = async (articleId: string) => {
    try {
      const reason = prompt('Raison du refus (optionnel):')
      const response = await fetch(`/api/v1/articles/${articleId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      if (response.ok) {
        // Refresh the list
        fetchPendingArticles()
      }
    } catch (error) {
      console.error('Error rejecting article:', error)
    }
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
          <h1 className="text-2xl font-bold text-white">Articles en Attente</h1>
          <p className="text-slate-400">Examinez et approuvez les articles soumis</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {articles.length} en attente
        </Badge>
      </div>

      {articles.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Aucun article en attente</h3>
            <p className="text-slate-400">Tous les articles ont été examinés.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <Card key={article._id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl">{article.title}</CardTitle>
                    <CardDescription className="text-slate-400 mt-2">
                      Par {article.author.name} • Soumis le {new Date(article.submittedAt).toLocaleDateString('fr-FR')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <Badge variant="default">En attente</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Auteur</h4>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <User className="h-4 w-4" />
                      <span>{article.author.name}</span>
                      <span>•</span>
                      <span>{article.author.email}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Contenu</h4>
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <p className="text-slate-300 text-sm line-clamp-3">
                        {article.content.substring(0, 300)}
                        {article.content.length > 300 && '...'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="text-sm text-slate-400">
                      Soumis le {new Date(article.submittedAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/admin/blog/${article._id}`, '_blank')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Examiner
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(article._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approuver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(article._id)}
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Refuser
                      </Button>
                    </div>
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
