'use client'

import { useEffect, useState } from 'react'
import { MotionDiv, MotionH2, MotionP } from '@/components/MotionComponents'
import {
  Megaphone,
  Smartphone,
  Palette,
  TrendingUp,
  ShoppingBag,
  Users,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/Button'
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

export const ServicesSection = () => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
            Nos Services
          </MotionH2>
          <MotionP className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            Une gamme complète de services digitaux pour accompagner votre croissance
            et maximiser votre impact sur le marché.
          </MotionP>
        </MotionDiv>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">Failed to load services</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-slate-400">No services available at the moment.</p>
          </div>
        ) : (
          <MotionDiv
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon || 'Megaphone'] || Megaphone
              return (
                <MotionDiv
                  key={service._id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-blue-900/30 rounded-lg mb-6 mx-auto">
                    <IconComponent className="w-8 h-8 text-primary-600 dark:text-blue-400" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 mb-6 text-center leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {(service.features || []).filter((feature: string) => feature !== null && feature !== undefined).map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center text-gray-600 dark:text-slate-400">
                        <div className="w-2 h-2 bg-primary-500 dark:bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="outline"
                    className="w-full group border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
                  >
                    En savoir plus
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </MotionDiv>
              )
            })}
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
            Besoin d'une solution personnalisée ? Nos experts sont là pour vous accompagner.
          </p>
          <Button size="lg">
            Demander un devis personnalisé
          </Button>
        </MotionDiv>
      </div>
    </section>
  )
}
