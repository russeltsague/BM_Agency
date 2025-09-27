'use client'

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

export default function ServicesPage() {
  const services = [
    {
      id: 'digital-communication',
      icon: Megaphone,
      title: 'Communication Digitale',
      description: 'Stratégies de communication globale et digitale pour développer votre présence en ligne et engager votre audience camerounaise.',
      features: [
        'Community Management',
        'Publicité digitale (SEA)',
        'Relations presse digitales',
        'Content Marketing',
        'Social Media Strategy',
        'Influence Marketing'
      ],
      benefits: [
        'Augmentation de la visibilité locale',
        'Engagement accru des clients',
        'Génération de leads qualifiés',
        'Amélioration de l\'e-réputation'
      ],
      pricing: 'À partir de 250 000 FCFA/mois',
      duration: '6-12 mois',
      caseStudy: 'E-commerce +300% trafic social'
    },
    {
      id: 'digital-marketing',
      icon: Smartphone,
      title: 'Marketing Digital',
      description: 'Optimisation de votre visibilité et acquisition de nouveaux clients sur le web avec des stratégies data-driven adaptées au marché camerounais.',
      features: [
        'SEO/SEA avancé',
        'Marketing automation',
        'Analytics et tracking',
        'Growth Hacking',
        'Email marketing',
        'Conversion optimization'
      ],
      benefits: [
        'ROI mesurable',
        'Acquisition clients optimisée',
        'Taux de conversion amélioré',
        'Suivi performance en temps réel'
      ],
      pricing: 'À partir de 2 000€/mois',
      duration: '3-6 mois',
      caseStudy: 'SaaS +150% conversions'
    },
    {
      id: 'design-branding',
      icon: Palette,
      title: 'Design & Branding',
      description: 'Création d\'identités visuelles uniques et mémorables pour votre marque, du concept à la déclinaison.',
      features: [
        'Identité visuelle complète',
        'Charte graphique',
        'Design web & mobile',
        'Print design',
        'Motion design',
        'Brand guidelines'
      ],
      benefits: [
        'Image de marque cohérente',
        'Reconnaissance immédiate',
        'Différenciation concurrentielle',
        'Support tous formats'
      ],
      pricing: 'À partir de 3 000€',
      duration: '4-8 semaines',
      caseStudy: 'Startup fintech +200% notoriété'
    },
    {
      id: 'digital-strategy',
      icon: TrendingUp,
      title: 'Stratégie Digitale',
      description: 'Accompagnement stratégique complet pour votre transformation digitale et croissance business.',
      features: [
        'Audit digital complet',
        'Plan de transformation',
        'Formation équipes',
        'Veille stratégique',
        'Roadmap digitale',
        'KPI et objectifs'
      ],
      benefits: [
        'Vision claire et structurée',
        'Priorités définies',
        'Équipes formées',
        'Résultats mesurables'
      ],
      pricing: 'À partir de 5 000€',
      duration: '2-4 mois',
      caseStudy: 'Industrie +400% efficacité digitale'
    },
    {
      id: 'advertising-objects',
      icon: ShoppingBag,
      title: 'Objets Publicitaires',
      description: 'Solutions de communication par l\'objet personnalisées et impactantes pour votre marque.',
      features: [
        'Goodies personnalisés',
        'Textile corporate',
        'Objets high-tech',
        'Écologiques & durables',
        'Packaging sur-mesure',
        'Logistique et stockage'
      ],
      benefits: [
        'Visibilité quotidienne',
        'Cadeaux clients originaux',
        'Événementiel impactant',
        'Démarche RSE valorisée'
      ],
      pricing: 'À partir de 500€',
      duration: '2-4 semaines',
      caseStudy: 'Corporate +50% mémorisation'
    },
    {
      id: 'training-coaching',
      icon: Users,
      title: 'Formation & Coaching',
      description: 'Formation de vos équipes aux meilleures pratiques du digital et accompagnement personnalisé.',
      features: [
        'Formations sur mesure',
        'Coaching individuel',
        'Workshops pratiques',
        'E-learning personnalisé',
        'Certification digitale',
        'Suivi post-formation'
      ],
      benefits: [
        'Équipes autonomisées',
        'Compétences actualisées',
        'Productivité améliorée',
        'Innovation encouragée'
      ],
      pricing: 'À partir de 150€/heure',
      duration: '1-3 mois',
      caseStudy: 'PME +300% compétences digitales'
    }
  ]

  const processSteps = [
    {
      step: '01',
      title: 'Brief & Analyse',
      description: 'Compréhension de vos besoins et analyse de votre situation actuelle.'
    },
    {
      step: '02',
      title: 'Stratégie',
      description: 'Élaboration d\'une stratégie personnalisée et définition des objectifs.'
    },
    {
      step: '03',
      title: 'Création',
      description: 'Conception et développement des solutions selon le cahier des charges.'
    },
    {
      step: '04',
      title: 'Déploiement',
      description: 'Mise en production et formation de vos équipes si nécessaire.'
    },
    {
      step: '05',
      title: 'Suivi & Optimisation',
      description: 'Monitoring des performances et optimisations continues.'
    }
  ]

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
              Nos <span className="text-primary-600 dark:text-blue-400">Services</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
              Découvrez notre gamme complète de services digitaux conçus pour propulser
              votre entreprise vers le succès. Chaque solution est personnalisée selon vos
              objectifs et votre secteur d'activité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-900 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-blue-900/30 rounded-lg mb-6">
                  <service.icon className="w-8 h-8 text-primary-600 dark:text-blue-400" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-3">Inclus :</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600 dark:text-slate-400 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-slate-400">Prix :</span>
                      <div className="font-semibold text-gray-900 dark:text-slate-100">{service.pricing}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-slate-400">Durée :</span>
                      <div className="font-semibold text-gray-900 dark:text-slate-100">{service.duration}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-primary-600 dark:text-blue-400 font-medium">
                    📈 {service.caseStudy}
                  </div>
                </div>

                <Button variant="outline" className="w-full group border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500">
                  En savoir plus
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              Notre Méthodologie
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              Un processus éprouvé et collaboratif pour garantir le succès de votre projet.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-600 dark:bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary-200 dark:bg-blue-700 transform -translate-x-16"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
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
              Besoin d'une solution sur mesure ?
            </h2>
            <p className="text-xl text-primary-100 dark:text-blue-100 mb-8 max-w-3xl mx-auto">
              Nos experts étudient votre projet et vous proposent une solution personnalisée
              adaptée à vos besoins et votre budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Clock className="mr-2 w-5 h-5" />
                Consultation gratuite
              </Button>
              <Button size="lg">
                <Award className="mr-2 w-5 h-5" />
                Devis personnalisé
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
