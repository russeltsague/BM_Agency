'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Star,
  Filter
} from 'lucide-react'
import Image from 'next/image'
import { realisationsAPI, type Realisation } from '@/lib/api'

export default function PortfolioPage() {
  const [realisations, setRealisations] = useState<Realisation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  useEffect(() => {
    const fetchRealisations = async () => {
      try {
        setIsLoading(true)
        const response = await realisationsAPI.getAll()
        const items = response?.data
        setRealisations(Array.isArray(items) ? items : [])
      } catch (err: any) {
        console.error('Failed to fetch realisations:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRealisations()
  }, [])

  const categories = ['Tous', ...Array.from(new Set(realisations.map(realisation => realisation.category).filter(Boolean)))]

  const filteredRealisations = realisations.filter(realisation => {
    return selectedCategory === 'Tous' || realisation.category === selectedCategory
  })

  const featuredRealisations = filteredRealisations.filter(realisation => realisation.featured)
  const otherRealisations = filteredRealisations.filter(realisation => !realisation.featured)

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
            <p className="text-gray-600 dark:text-slate-400">Chargement des réalisations...</p>
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
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Nos <span className="text-primary-600 dark:text-blue-400">Réalisations</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
              Découvrez une sélection de nos projets les plus marquants et les résultats
              exceptionnels obtenus pour nos clients dans divers secteurs d'activité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? 'primary' : 'outline'}
                size="sm"
                className="mb-2"
                onClick={() => setSelectedCategory(category || 'Tous')}
              >
                <Filter className="w-4 h-4 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredRealisations.map((realisation) => (
              <motion.div
                key={realisation._id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
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
                        {realisation.category === 'E-commerce' && '🛒'}
                        {realisation.category === 'Application Mobile' && '📱'}
                        {realisation.category === 'Site Web' && '🌐'}
                        {realisation.category === 'SaaS' && '☁️'}
                        {realisation.category === 'Marketing Digital' && '📢'}
                        {realisation.category === 'Branding' && '🎨'}
                      </div>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {realisation.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 dark:bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        ⭐ Projet phare
                      </span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 dark:group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="secondary" className="mr-2">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir détails
                      </Button>
                      <Button size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Live demo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary-600 bg-primary-100 dark:text-blue-400 dark:bg-blue-900/30 px-2 py-1 rounded">
                      {realisation.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">{realisation.client}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-blue-400 transition-colors">
                    {realisation.title}
                  </h3>

                  <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {realisation.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {realisation.tags?.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button variant="outline" size="sm" className="w-full group border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500">
                    Voir le projet complet
                    <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Vous avez un projet en tête ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
              Discutons ensemble de votre projet et créons une solution sur mesure
              qui dépassera vos attentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Calendar className="mr-2 w-5 h-5" />
                Planifier un appel
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500">
                Voir plus de projets
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
