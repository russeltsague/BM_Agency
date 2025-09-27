'use client'

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

export default function PortfolioPage() {
  const projects = [
    {
      id: 1,
      title: 'Plateforme E-commerce Mode Africaine',
      category: 'E-commerce',
      client: 'Maison de la Mode Africaine',
      description: 'Refonte complète d\'une plateforme e-commerce spécialisée dans la mode africaine avec optimisation UX/UI et intégration de solutions de paiement locales. Résultat : +400% de conversions.',
      image: '/images/portfolio-1.jpg',
      tags: ['React', 'Node.js', 'MTN MoMo', 'SEO'],
      metrics: [
        { label: 'Conversions', value: '+400%', icon: TrendingUp },
        { label: 'Temps de chargement', value: '-50%', icon: Star },
        { label: 'Taux de rebond', value: '-30%', icon: Users }
      ],
      featured: true,
      link: '#'
    },
    {
      id: 2,
      title: 'Application Mobile Bancaire',
      category: 'Application Mobile',
      client: 'Banque Atlantique Cameroun',
      description: 'Développement d\'une application mobile bancaire avec authentification biométrique et gestion des comptes en temps réel pour les clients camerounais.',
      image: '/images/portfolio-2.jpg',
      tags: ['React Native', 'Node.js', 'MongoDB', 'Biometric'],
      metrics: [
        { label: 'Utilisateurs actifs', value: '50K+', icon: Users },
        { label: 'Note App Store', value: '4.8/5', icon: Star },
        { label: 'Temps de réponse', value: '< 2s', icon: TrendingUp }
      ],
      featured: true,
      link: '#'
    },
    {
      id: 3,
      title: 'Site Corporate Industrie',
      category: 'Site Web',
      client: 'Tech Industries',
      description: 'Création d\'un site corporate pour un leader de l\'industrie avec système de gestion de contenu personnalisé.',
      image: '/images/portfolio-3.jpg',
      tags: ['Next.js', 'Sanity CMS', 'Tailwind CSS', 'Animations'],
      metrics: [
        { label: 'Trafic organique', value: '+150%', icon: TrendingUp },
        { label: 'Pages/sessions', value: '+80%', icon: Star },
        { label: 'Taux conversion', value: '+45%', icon: Users }
      ],
      featured: false,
      link: '#'
    },
    {
      id: 4,
      title: 'Plateforme SaaS RH',
      category: 'SaaS',
      client: 'HR Solutions',
      description: 'Développement d\'une plateforme SaaS complète pour la gestion des ressources humaines avec dashboard analytics.',
      image: '/images/portfolio-4.jpg',
      tags: ['Vue.js', 'Python', 'PostgreSQL', 'Docker'],
      metrics: [
        { label: 'Utilisateurs', value: '10K+', icon: Users },
        { label: 'Temps d\'implémentation', value: '-60%', icon: Star },
        { label: 'ROI', value: '+400%', icon: TrendingUp }
      ],
      featured: false,
      link: '#'
    },
    {
      id: 5,
      title: 'Campagne Publicitaire Digitale',
      category: 'Marketing Digital',
      client: 'StartupTech',
      description: 'Stratégie digitale complète avec création de contenu, gestion des réseaux sociaux et optimisation publicitaire.',
      image: '/images/portfolio-5.jpg',
      tags: ['Social Media', 'Content Marketing', 'Ads', 'Analytics'],
      metrics: [
        { label: 'Portée', value: '1M+', icon: Users },
        { label: 'Engagement', value: '+250%', icon: Star },
        { label: 'Coût/acquisition', value: '-35%', icon: TrendingUp }
      ],
      featured: false,
      link: '#'
    },
    {
      id: 6,
      title: 'Brand Identity Startup',
      category: 'Branding',
      client: 'FinTech Pro',
      description: 'Création complète d\'identité visuelle pour une startup fintech, du logo au guideline de marque.',
      image: '/images/portfolio-6.jpg',
      tags: ['Logo Design', 'Brand Guidelines', 'Print', 'Digital Assets'],
      metrics: [
        { label: 'Notoriété', value: '+200%', icon: Star },
        { label: 'Reconnaissance', value: '+85%', icon: Users },
        { label: 'Cohérence', value: '100%', icon: TrendingUp }
      ],
      featured: false,
      link: '#'
    }
  ]

  const categories = ['Tous', 'E-commerce', 'Application Mobile', 'Site Web', 'SaaS', 'Marketing Digital', 'Branding']

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
                variant={category === 'Tous' ? 'primary' : 'outline'}
                size="sm"
                className="mb-2"
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
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-slate-700 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                    <div className="text-6xl text-primary-300 dark:text-blue-400">
                      {project.category === 'E-commerce' && '🛒'}
                      {project.category === 'Application Mobile' && '📱'}
                      {project.category === 'Site Web' && '🌐'}
                      {project.category === 'SaaS' && '☁️'}
                      {project.category === 'Marketing Digital' && '📢'}
                      {project.category === 'Branding' && '🎨'}
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
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
                      {project.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">{project.client}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {project.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="text-center p-2 bg-gray-50 dark:bg-slate-700 rounded">
                        <metric.icon className="w-4 h-4 text-primary-600 dark:text-blue-400 mx-auto mb-1" />
                        <div className="text-xs font-semibold text-gray-900 dark:text-slate-100">{metric.value}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag, tagIndex) => (
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
