'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MotionDiv, MotionH2, MotionP } from '@/components/MotionComponents'
import { ExternalLink, Eye } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/Button'
import { realisationsAPI, type Realisation } from '@/lib/api'
import { useTranslations } from 'next-intl'

// Category emoji mapping
const categoryEmojis: Record<string, string> = {
  'E-commerce': '🛍️',
  'Application Mobile': '📱',
  'Site Web': '🌐',
  'SaaS': '☁️',
  'Marketing Digital': '📢',
  'Branding': '🎨',
  'default': '💼'
}

export const PortfolioSection = () => {
  const router = useRouter()
  const t = useTranslations('PortfolioSection')
  const [realisations, setRealisations] = useState<Realisation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchRealisations = async () => {
      try {
        setIsLoading(true)
        const response = await realisationsAPI.getAll()
        const items = response?.data
        setRealisations(Array.isArray(items) ? items.slice(0, 6) : [])
      } catch (err: unknown) {
        console.error('Failed to fetch realisations:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRealisations()
  }, [])

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

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
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
          <MotionP className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            {t('subtitle')}
          </MotionP>
        </MotionDiv>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 dark:text-slate-400">{t('loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{t('error')}</p>
            <Button onClick={() => window.location.reload()}>{t('retry')}</Button>
          </div>
        ) : !Array.isArray(realisations) || realisations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-slate-400">{t('noItems')}</p>
          </div>
        ) : (
          <MotionDiv
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {realisations.map((realisation) => (
              <MotionDiv
                key={realisation._id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-slate-700 overflow-hidden">
                  {realisation.image ? (
                    <Image
                      src={realisation.image}
                      alt={realisation.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                      <div className="text-6xl text-primary-300 dark:text-blue-400">
                        {categoryEmojis[realisation.category || 'default'] || categoryEmojis.default}
                      </div>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 dark:group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="secondary" className="mr-2">
                        <Eye className="w-4 h-4 mr-1" />
                        {t('view')}
                      </Button>
                      {realisation.link && (
                        <Button size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          {t('live')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    {realisation.category && (
                      <span className="text-xs font-medium text-primary-600 bg-primary-100 dark:text-blue-400 dark:bg-blue-900/30 px-2 py-1 rounded">
                        {realisation.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-blue-400 transition-colors">
                    {realisation.title}
                  </h3>

                  <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {realisation.description}
                  </p>

                  {/* Tags */}
                  {realisation.tags && realisation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {realisation.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <Button variant="outline" size="sm" className="w-full group border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500">
                    {t('viewProject')}
                    <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        )}

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            {t('ctaText')}
          </p>
          <Button 
            size="lg" 
            onClick={() => {
              // Get the current locale from the URL or default to 'fr'
              const locale = window.location.pathname.split('/')[1] || 'fr';
              router.push(`/${locale}/portfolio`);
            }}
            className="group"
          >
            {t('ctaButton')}
            <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </MotionDiv>
      </div>
    </section>
  )
}
