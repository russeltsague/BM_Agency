'use client'

import { MotionDiv, MotionH2, MotionP } from '@/components/MotionComponents'
import { ExternalLink, Eye } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/Button'

export const PortfolioSection = () => {
  const projects = [
    {
      id: 1,
      title: 'E-commerce Fashion Store',
      category: 'E-commerce',
      description: 'Refonte complète d\'une plateforme e-commerce avec optimisation UX/UI et intégration de solutions de paiement modernes.',
      image: '/images/portfolio-1.jpg',
      tags: ['React', 'Node.js', 'Stripe', 'SEO'],
      link: '#'
    },
    {
      id: 2,
      title: 'Application Mobile Banque',
      category: 'Application Mobile',
      description: 'Développement d\'une application mobile bancaire avec authentification biométrique et gestion des comptes en temps réel.',
      image: '/images/portfolio-2.jpg',
      tags: ['React Native', 'Node.js', 'MongoDB', 'Biometric'],
      link: '#'
    },
    {
      id: 3,
      title: 'Site Corporate Industrie',
      category: 'Site Web',
      description: 'Création d\'un site corporate pour un leader de l\'industrie avec système de gestion de contenu personnalisé.',
      image: '/images/portfolio-3.jpg',
      tags: ['Next.js', 'Sanity CMS', 'Tailwind CSS', 'Animations'],
      link: '#'
    },
    {
      id: 4,
      title: 'Plateforme SaaS RH',
      category: 'SaaS',
      description: 'Développement d\'une plateforme SaaS complète pour la gestion des ressources humaines avec dashboard analytics.',
      image: '/images/portfolio-4.jpg',
      tags: ['Vue.js', 'Python', 'PostgreSQL', 'Docker'],
      link: '#'
    },
    {
      id: 5,
      title: 'Campagne Publicitaire Digitale',
      category: 'Marketing Digital',
      description: 'Stratégie digitale complète avec création de contenu, gestion des réseaux sociaux et optimisation publicitaire.',
      image: '/images/portfolio-5.jpg',
      tags: ['Social Media', 'Content Marketing', 'Ads', 'Analytics'],
      link: '#'
    },
    {
      id: 6,
      title: 'Brand Identity Startup',
      category: 'Branding',
      description: 'Création complète d\'identité visuelle pour une startup fintech, du logo au guideline de marque.',
      image: '/images/portfolio-6.jpg',
      tags: ['Logo Design', 'Brand Guidelines', 'Print', 'Digital Assets'],
      link: '#'
    }
  ]

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
            Nos Réalisations
          </MotionH2>
          <MotionP className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            Découvrez quelques-uns de nos projets les plus marquants et les résultats
            obtenus pour nos clients.
          </MotionP>
        </MotionDiv>

        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <MotionDiv
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
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

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 dark:group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="secondary" className="mr-2">
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Live
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
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

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
                  Voir le projet
                  <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            Vous souhaitez voir plus de projets ou discuter d'une collaboration ?
          </p>
          <Button size="lg">
            Voir tous nos projets
          </Button>
        </MotionDiv>
      </div>
    </section>
  )
}
