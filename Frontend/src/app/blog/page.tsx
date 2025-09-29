'use client'

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
  BookOpen,
  TrendingUp
} from 'lucide-react'

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Les tendances du marketing digital au Cameroun en 2024',
      excerpt: 'Découvrez les principales tendances qui façonneront le marketing digital camerounais cette année et comment les intégrer dans votre stratégie d\'entreprise.',
      content: 'Le marketing digital au Cameroun évolue à un rythme effréné. En 2024, plusieurs tendances majeures se démarquent et redéfinissent la façon dont les entreprises interagissent avec leur audience...',
      image: '/images/blog-1.jpg',
      author: 'Marie Dubois',
      date: '15 Jan 2024',
      readTime: '8 min',
      category: 'Marketing Digital',
      featured: true,
      tags: ['Tendances', 'Marketing', 'Cameroun', '2024']
    },
    {
      id: 2,
      title: 'Comment optimiser son SEO pour les moteurs de recherche au Cameroun',
      excerpt: 'Guide complet pour améliorer le référencement de votre site web et augmenter votre visibilité sur Google et autres moteurs de recherche locaux.',
      content: 'Le SEO (Search Engine Optimization) reste un pilier fondamental du marketing digital camerounais. Dans cet article, nous vous dévoilons les meilleures pratiques...',
      image: '/images/blog-2.jpg',
      author: 'Thomas Martin',
      date: '12 Jan 2024',
      readTime: '12 min',
      category: 'SEO',
      featured: false,
      tags: ['SEO', 'Référencement', 'Google', 'Cameroun']
    },
    {
      id: 3,
      title: 'L\'importance du design thinking en UX/UI',
      excerpt: 'Pourquoi adopter une approche design thinking pour créer des expériences utilisateur exceptionnelles et mémorables.',
      content: 'Le design thinking n\'est pas qu\'une méthodologie à la mode. C\'est une approche centrée sur l\'utilisateur qui révolutionne la création de produits digitaux...',
      image: '/images/blog-3.jpg',
      author: 'Sophie Chen',
      date: '08 Jan 2024',
      readTime: '6 min',
      category: 'Design',
      featured: false,
      tags: ['Design Thinking', 'UX', 'UI', 'Expérience utilisateur']
    },
    {
      id: 4,
      title: 'IA et Marketing : Le futur de la personnalisation',
      excerpt: 'Comment l\'intelligence artificielle transforme le marketing digital et permet une personnalisation à grande échelle.',
      content: 'L\'intelligence artificielle n\'est plus de la science-fiction. Elle est devenue un outil indispensable pour les marketeurs modernes...',
      image: '/images/blog-4.jpg',
      author: 'Pierre Durand',
      date: '05 Jan 2024',
      readTime: '10 min',
      category: 'IA & Tech',
      featured: false,
      tags: ['Intelligence Artificielle', 'Personnalisation', 'Marketing', 'Technologie']
    },
    {
      id: 5,
      title: 'Les secrets d\'une stratégie social media réussie',
      excerpt: 'Conseils pratiques pour développer votre présence sur les réseaux sociaux et engager votre communauté efficacement.',
      content: 'Les réseaux sociaux sont devenus incontournables pour toute stratégie digitale. Mais comment se démarquer dans ce paysage saturé ?...',
      image: '/images/blog-5.jpg',
      author: 'Amélie Moreau',
      date: '02 Jan 2024',
      readTime: '7 min',
      category: 'Social Media',
      featured: false,
      tags: ['Réseaux sociaux', 'Community Management', 'Engagement', 'Stratégie']
    },
    {
      id: 6,
      title: 'E-commerce 2024 : Les clés du succès',
      excerpt: 'Analyse des meilleures pratiques e-commerce et des innovations qui transforment le secteur du commerce en ligne.',
      content: 'Le e-commerce continue sa croissance exponentielle. En 2024, de nouvelles tendances émergent et redéfinissent les règles du jeu...',
      image: '/images/blog-6.jpg',
      author: 'Jean-François Leroy',
      date: '28 Déc 2023',
      readTime: '9 min',
      category: 'E-commerce',
      featured: false,
      tags: ['E-commerce', 'Vente en ligne', 'Conversion', 'UX']
    }
  ]

  const categories = ['Tous', 'Marketing Digital', 'SEO', 'Design', 'IA & Tech', 'Social Media', 'E-commerce']

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Actualités & <span className="text-primary-600 dark:text-blue-400">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
              Restez à la pointe des dernières tendances du digital avec nos articles
              d'experts. Conseils pratiques, analyses et insights pour votre stratégie digitale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === 'Tous' ? 'primary' : 'outline'}
                  size="sm"
                  className="border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
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
                    {blogPosts[0].category}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                  {blogPosts[0].title}
                </h2>

                <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-slate-400">
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
      <section className="py-16 lg:py-20 bg-slate-900 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {blogPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
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
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.date}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
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
