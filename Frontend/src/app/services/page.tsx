'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { motion } from 'framer-motion'
import {
  Megaphone,
  Smartphone,
  Palette,
  TrendingUp,
  ShoppingBag,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  Award
} from 'lucide-react'
import { servicesAPI, type Service } from '@/lib/api'

// Icon mapping
const iconMap: Record<string, any> = {
  Megaphone,
  Smartphone,
  Palette,
  TrendingUp,
  ShoppingBag,
  Users,
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        const response = await servicesAPI.getAll()
        const items = response?.data
        setServices(Array.isArray(items) ? items : [])
      } catch (err: any) {
        console.error('Failed to fetch services:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-slate-400">Chargement des services...</p>
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
              Nos <span className="text-primary-600 dark:text-blue-400">Services</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
              Découvrez notre gamme complète de services digitaux conçus pour accompagner
              votre croissance et maximiser votre présence en ligne au Cameroun.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon || ''] || Smartphone
              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-blue-600"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <IconComponent className="w-8 h-8 text-primary-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4 group-hover:text-primary-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Ce que nous offrons :</h4>
                    <ul className="space-y-2">
                      {service.features?.slice(0, 4).map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center text-gray-600 dark:text-slate-400">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">À partir de</p>
                      <p className="text-lg font-bold text-primary-600 dark:text-blue-400">{service.pricing}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Durée</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{service.duration}</p>
                    </div>
                  </div>

                  <Button className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-blue-600 dark:hover:bg-blue-700 group-hover:shadow-lg transition-all">
                    En savoir plus
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à transformer votre présence digitale ?
            </h2>
            <p className="text-lg lg:text-xl text-primary-100 dark:text-blue-100 mb-8 max-w-3xl mx-auto">
              Contactez-nous dès aujourd'hui pour une consultation gratuite et découvrez
              comment nos services peuvent accélérer votre croissance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white dark:bg-slate-800 text-primary-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700">
                Consultation gratuite
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600 dark:border-slate-300 dark:text-slate-300 dark:hover:bg-slate-300 dark:hover:text-blue-600">
                Voir nos réalisations
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
