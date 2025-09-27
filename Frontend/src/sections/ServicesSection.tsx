'use client'

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

export const ServicesSection = () => {
  const services = [
    {
      icon: Megaphone,
      title: 'Communication Digitale',
      description: 'Stratégies de communication globale et digitale pour développer votre présence en ligne.',
      features: ['Community Management', 'Publicité digitale', 'Relations presse', 'Content Marketing']
    },
    {
      icon: Smartphone,
      title: 'Marketing Digital',
      description: 'Optimisation de votre visibilité et acquisition de nouveaux clients sur le web.',
      features: ['SEO/SEA', 'Marketing automation', 'Analytics', 'Growth Hacking']
    },
    {
      icon: Palette,
      title: 'Design & Branding',
      description: 'Création d\'identités visuelles uniques et mémorables pour votre marque.',
      features: ['Identité visuelle', 'Charte graphique', 'Design web', 'Print design']
    },
    {
      icon: TrendingUp,
      title: 'Stratégie Digitale',
      description: 'Accompagnement stratégique pour votre transformation digitale.',
      features: ['Audit digital', 'Plan de transformation', 'Formation', 'Veille stratégique']
    },
    {
      icon: ShoppingBag,
      title: 'Objets Publicitaires',
      description: 'Solutions de communication par l\'objet personnalisées et impactantes.',
      features: ['Goodies personnalisés', 'Textile', 'Objets high-tech', 'Écologiques']
    },
    {
      icon: Users,
      title: 'Formation & Coaching',
      description: 'Formation de vos équipes aux meilleures pratiques du digital.',
      features: ['Formations sur mesure', 'Coaching individuel', 'Workshops', 'E-learning']
    }
  ]

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

        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <MotionDiv
              key={service.title}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-blue-900/30 rounded-lg mb-6 mx-auto">
                <service.icon className="w-8 h-8 text-primary-600 dark:text-blue-400" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 text-center">
                {service.title}
              </h3>

              <p className="text-gray-600 dark:text-slate-400 mb-6 text-center leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
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
