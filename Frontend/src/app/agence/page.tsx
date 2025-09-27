'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { MotionDiv, MotionH2, MotionH4 } from '@/components/MotionComponents'
import {
  Users,
  Target,
  Award,
  TrendingUp,
  CheckCircle,
  Quote,
  Calendar,
  MapPin,
  Mail
} from 'lucide-react'

export default function AgencyPage() {
  const teamMembers = [
    {
      name: 'Jean Dupont',
      role: 'Directeur Général',
      description: 'Expert en stratégie digitale avec 15 ans d\'expérience dans le secteur.',
      image: '/images/team-1.jpg',
      achievements: ['MBA HEC', '15 ans d\'expérience', '50+ projets réussis']
    },
    {
      name: 'Marie Martin',
      role: 'Directrice Artistique',
      description: 'Créative passionnée spécialisée dans l\'identité visuelle et l\'UX design.',
      image: '/images/team-2.jpg',
      achievements: ['Design Award 2023', '10 ans d\'expérience', '200+ marques créées']
    },
    {
      name: 'Pierre Durand',
      role: 'Consultant SEO/SEA',
      description: 'Spécialiste en référencement naturel et publicité digitale.',
      image: '/images/team-3.jpg',
      achievements: ['Google Partner', '8 ans d\'expérience', 'ROI +300% moyen']
    },
    {
      name: 'Sophie Chen',
      role: 'Développeuse Full-Stack',
      description: 'Experte en développement web et applications mobiles.',
      image: '/images/team-4.jpg',
      achievements: ['React Expert', 'Node.js Specialist', '100+ apps développées']
    }
  ]

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'Nous visons l\'excellence dans chaque projet que nous réalisons.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Nous travaillons main dans la main avec nos clients pour des résultats optimaux.'
    },
    {
      icon: Award,
      title: 'Innovation',
      description: 'Nous restons à la pointe des dernières tendances et technologies digitales.'
    },
    {
      icon: TrendingUp,
      title: 'Résultats',
      description: 'Nous nous engageons sur des objectifs mesurables et un ROI démontré.'
    }
  ]

  const milestones = [
    { year: '2018', event: 'Création de BM Agency' },
    { year: '2019', event: 'Ouverture du bureau parisien' },
    { year: '2020', event: 'Lancement de la division e-commerce' },
    { year: '2021', event: 'Plus de 100 clients satisfaits' },
    { year: '2022', event: 'Expansion équipe +50%' },
    { year: '2023', event: 'Lancement service IA & Automation' },
    { year: '2024', event: 'Objectif 1000 projets réalisés' }
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              À Propos de{' '}
              <span className="text-primary-600 dark:text-blue-400">BM Agency</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
              Depuis 2018, nous accompagnons les entreprises dans leur transformation digitale
              avec passion, expertise et innovation. Notre mission : faire briller votre marque
              dans l'univers numérique.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-slate-900 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <MotionDiv
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <MotionH2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                Notre Histoire
              </MotionH2>
              <div className="space-y-6 text-gray-600 dark:text-slate-400">
                <p>
                  BM Agency est née de la passion de deux entrepreneurs visionnaires qui ont
                  compris très tôt l'importance du digital dans la stratégie des entreprises.
                </p>
                <p>
                  Depuis notre création en 2018, nous avons grandi en gardant toujours la même
                  ambition : accompagner nos clients vers le succès digital avec des solutions
                  innovantes et personnalisées.
                </p>
                <p>
                  Aujourd'hui, avec une équipe de plus de 50 experts et des centaines de projets
                  réussis, nous sommes devenus un partenaire de confiance pour les entreprises
                  de toutes tailles.
                </p>
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-8 border border-gray-100 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">500+</div>
                    <div className="text-gray-600 dark:text-slate-400">Projets réalisés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">98%</div>
                    <div className="text-gray-600 dark:text-slate-400">Clients satisfaits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">50+</div>
                    <div className="text-gray-600 dark:text-slate-400">Experts digitaux</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">6</div>
                    <div className="text-gray-600 dark:text-slate-400">Années d'expérience</div>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Notre Histoire
            </MotionH2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              Depuis plus de 10 ans, BM Agency accompagne les entreprises dans leur transformation digitale avec passion et expertise.
            </p>
          </MotionDiv>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <MotionDiv
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                Notre Vision
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Nous croyons que le digital est un levier de croissance essentiel pour toutes les entreprises.
                Notre mission est d'accompagner nos clients dans cette transformation avec des solutions
                innovantes et personnalisées.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">500+</div>
                  <div className="text-gray-600 dark:text-slate-400">Projets réalisés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">98%</div>
                  <div className="text-gray-600 dark:text-slate-400">Clients satisfaits</div>
                </div>
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                Notre Équipe
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
                Rencontrez les experts passionnés qui font le succès de BM Agency.
              </p>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-900 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              Rencontrez les experts passionnés qui font le succès de BM Agency.
            </p>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <MotionDiv
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-slate-700"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-primary-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">
                  {member.description}
                </p>
                <div className="space-y-1">
                  {member.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex items-center text-xs text-gray-500 dark:text-slate-400">
                      <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              Notre Parcours
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              Les étapes clés de notre croissance et de notre évolution.
            </p>
          </MotionDiv>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200 dark:bg-blue-700"></div>

            {milestones.map((milestone, index) => (
              <MotionDiv
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center mb-8 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`${index % 2 === 0 ? 'pr-8' : 'pl-8'} flex-1`}>
                  <div className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 ${
                    index % 2 === 0 ? 'text-right' : 'text-left'
                  }`}>
                    <div className="text-2xl font-bold text-primary-600 dark:text-blue-400 mb-2">
                      {milestone.year}
                    </div>
                    <p className="text-gray-700 dark:text-slate-300">
                      {milestone.event}
                    </p>
                  </div>
                </div>

                <div className="w-4 h-4 bg-primary-600 dark:bg-blue-400 rounded-full border-4 border-white dark:border-slate-800 shadow-lg z-10"></div>

                <div className="flex-1"></div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à travailler avec nous ?
            </h2>
            <p className="text-xl text-primary-100 dark:text-blue-100 mb-8 max-w-3xl mx-auto">
              Rejoignez les centaines d'entreprises qui nous font confiance pour leur transformation digitale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Calendar className="mr-2 w-5 h-5" />
                Prendre rendez-vous
              </Button>
              <Button size="lg">
                <Mail className="mr-2 w-5 h-5" />
                Demander un devis
              </Button>
            </div>
          </MotionDiv>
        </div>
      </section>

      <Footer />
    </main>
  )
}
