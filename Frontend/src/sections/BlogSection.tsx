'use client'

import { MotionDiv, MotionH2, MotionH4, MotionArticle } from '@/components/MotionComponents'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/Button'

export const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Les tendances du marketing digital en 2024',
      excerpt: 'Découvrez les principales tendances qui façonneront le marketing digital cette année et comment les intégrer dans votre stratégie.',
      image: '/images/blog-1.jpg',
      author: 'Marie Dubois',
      date: '15 Jan 2024',
      readTime: '5 min',
      category: 'Marketing Digital',
      featured: true
    },
    {
      id: 2,
      title: 'Comment optimiser son SEO pour les moteurs de recherche',
      excerpt: 'Guide complet pour améliorer le référencement de votre site web et augmenter votre visibilité sur Google.',
      image: '/images/blog-2.jpg',
      author: 'Thomas Martin',
      date: '12 Jan 2024',
      readTime: '8 min',
      category: 'SEO',
      featured: false
    },
    {
      id: 3,
      title: 'L\'importance du design thinking en UX/UI',
      excerpt: 'Pourquoi adopter une approche design thinking pour créer des expériences utilisateur exceptionnelles.',
      image: '/images/blog-3.jpg',
      author: 'Sophie Chen',
      date: '08 Jan 2024',
      readTime: '6 min',
      category: 'Design',
      featured: false
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
            Actualités & Blog
          </MotionH2>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            Restez informé des dernières tendances du digital et découvrez nos conseils
            d'experts pour développer votre présence en ligne.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Featured Post */}
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
                    Article à la une
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {blogPosts[0].author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {blogPosts[0].date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {blogPosts[0].readTime}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                  {blogPosts[0].title}
                </h3>

                <p className="text-gray-600 dark:text-slate-400 mb-4">
                  {blogPosts[0].excerpt}
                </p>

                <Button variant="outline" className="group border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500">
                  Lire l'article
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </MotionDiv>

          {/* Other Posts */}
          <div className="space-y-6">
            {blogPosts.slice(1).map((post, index) => (
              <MotionDiv
                key={post.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex border border-gray-100 dark:border-slate-700"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex-shrink-0 mr-4"></div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-slate-400 mb-2">
                    <span className="bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs">
                      {post.category}
                    </span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                    {post.title}
                  </h4>

                  <p className="text-gray-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                      {post.author} • {post.date}
                    </div>
                    <Button size="sm" variant="outline" className="border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500">
                      Lire
                    </Button>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" variant="outline" className="border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500">
            Voir tous les articles
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </MotionDiv>
      </div>
    </section>
  )
}
