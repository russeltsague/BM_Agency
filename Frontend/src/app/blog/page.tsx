'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { motion } from 'framer-motion'
import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  Search,
  Filter,
  BookOpen
} from 'lucide-react'
import { articlesAPI, type Article } from '@/lib/api'

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true)
        const response = await articlesAPI.getAll()
        const items = response?.data
        setArticles(Array.isArray(items) ? items : [])
      } catch (err: unknown) {
        console.error('Failed to fetch articles:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch articles')
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const categories = ['Tous', ...Array.from(new Set(articles.map(article => article.category).filter(Boolean)))]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredArticle = filteredArticles.find(article => article.featured) || filteredArticles[0]
  const otherArticles = filteredArticles.filter(article => article !== featuredArticle)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-slate-400">Chargement des articles...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">Erreur: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Actualités & <span className="text-primary-600 dark:text-blue-400">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
              Restez à la pointe des dernières tendances du digital avec nos articles
              d&apos;experts. Conseils pratiques, analyses et insights pour votre stratégie digitale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === selectedCategory ? 'primary' : 'outline'}
                  size="sm"
                  className="border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
                  onClick={() => setSelectedCategory(category || 'Tous')}
                >
                  <Filter className="w-4 h-4 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Featured Post */}
      <section className="py-8 lg:py-12 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700"
          >
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 h-48 md:h-64 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-900/30 dark:to-cyan-900/30"></div>
              <div className="w-full md:w-1/2 p-6 lg:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-yellow-500 dark:bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Article à la une
                  </span>
                  <span className="bg-primary-100 text-primary-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded text-xs">
                    {featuredArticle?.category}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                  {featuredArticle?.title}
                </h2>

                <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {featuredArticle?.excerpt}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-slate-400">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Admin User
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {featuredArticle?.createdAt ? new Date(featuredArticle.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredArticle?.readTime}
                    </div>
                  </div>
                  <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                    Lire l'article
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 lg:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {otherArticles.map((post: Article) => (
              <motion.article
                key={post._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
              >
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-900/30 dark:to-cyan-900/30"></div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs">
                      {post.category}
                    </span>
                    <div className="flex items-center text-xs text-gray-500 dark:text-slate-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3 hover:text-primary-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Admin User
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags?.slice(0, 3).map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-primary-100 text-primary-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="w-full group border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Lire l'article
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-20 bg-primary-600 dark:bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              Ne manquez aucun article
            </h2>
            <p className="text-lg lg:text-xl text-primary-100 dark:text-blue-100 mb-8 max-w-3xl mx-auto">
              Recevez nos derniers articles directement dans votre boîte mail.
              Une newsletter hebdomadaire avec les tendances du digital.
            </p>
            <div className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-blue-400"
                />
                <Button variant="secondary" className="bg-white dark:bg-slate-800 text-primary-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700">
                  S'abonner
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
