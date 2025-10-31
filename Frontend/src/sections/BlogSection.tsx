'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MotionDiv, MotionH2 } from '@/components/MotionComponents'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/Button'
import { articlesAPI, type Article } from '@/lib/api'
import { useTranslations } from 'next-intl'

export const BlogSection = () => {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('BlogSection')
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await articlesAPI.getAll()
        const items = response?.data
        setArticles(Array.isArray(items) ? items.slice(0, 3) : [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load articles')
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <MotionH2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            {t('title')}
          </MotionH2>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </MotionDiv>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 dark:text-slate-400 ml-4">{t('loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{t('error')}</p>
            <Button onClick={() => window.location.reload()}>{t('retry')}</Button>
          </div>
        ) : !Array.isArray(articles) || articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-slate-400">{t('noArticles')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Featured Post */}
            {articles[0] && (
              <MotionDiv
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:col-span-1"
              >
                <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-slate-700">
                  <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-900/30 dark:to-cyan-900/30">
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 dark:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {t('featuredBadge')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-slate-400 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {typeof articles[0].author === 'object' && articles[0].author?.name ? articles[0].author.name : 'Unknown Author'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(articles[0].createdAt)}
                      </div>
                      {articles[0].readTime && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {articles[0].readTime}
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                      {articles[0].title}
                    </h3>

                    <p className="text-gray-600 dark:text-slate-400 mb-4">
                      {articles[0].excerpt || articles[0].content.substring(0, 150) + '...'}
                    </p>

                    <Button variant="outline" className="group border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500">
                      {t('readArticle')}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </MotionDiv>
            )}

            {/* Other Posts */}
            <div className="space-y-6">
              {articles.slice(1).map((article, index) => (
                <MotionDiv
                  key={article._id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex border border-gray-100 dark:border-slate-700"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex-shrink-0 mr-4"></div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-slate-400 mb-2">
                      {article.category && (
                        <span className="bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs">
                          {article.category}
                        </span>
                      )}
                      {article.readTime && (
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                      {article.title}
                    </h4>

                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                      {article.excerpt || article.content.substring(0, 100) + '...'}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-slate-400">
                        {typeof article.author === 'object' && article.author?.name ? article.author.name : 'Unknown Author'} • {formatDate(article.createdAt)}
                      </div>
                      <Button size="sm" variant="outline" className="border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500">
                        {t('read')}
                      </Button>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        )}

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="mt-8 group"
            onClick={() => {
              // Get the current locale from the URL or default to 'fr'
              const locale = window.location.pathname.split('/')[1] || 'fr';
              router.push(`/${locale}/blog`);
            }}
          >
            {t('viewAll')}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </MotionDiv>
      </div>
    </section>
  )
}
