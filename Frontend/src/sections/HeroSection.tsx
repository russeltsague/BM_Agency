'use client'

import { MotionDiv, MotionH1, MotionP, MotionSection } from '@/components/MotionComponents'
import { Play, ArrowRight, CheckCircle, MessageCircle } from 'lucide-react'
import { Button } from '@/components/Button'

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden pt-20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-800/60"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl dark:from-blue-500/10 dark:to-cyan-500/10"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-slate-400/10 to-blue-400/10 rounded-full blur-3xl dark:from-slate-500/10 dark:to-blue-500/10"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[length:60px_60px] opacity-30 dark:opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <button
              onClick={() => window.open('https://wa.me/237675176974', '_blank')}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-8"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>

            <MotionH1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8"
            >
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent dark:from-slate-100 dark:via-blue-100 dark:to-slate-200">
                Communication
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-400 dark:to-blue-500">
                Digitale 360°
              </span>
            </MotionH1>

            <MotionP
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light dark:text-slate-400"
            >
              Depuis 2018, nous accompagnons les entreprises camerounaises dans leur transformation digitale
              avec passion, expertise et innovation. Notre mission : faire briller votre marque
              dans l'univers numérique africain.
            </MotionP>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600"
            >
              Demander un devis gratuit
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-slate-300 hover:border-blue-400 bg-white/80 backdrop-blur-sm hover:bg-blue-50 px-8 py-4 text-lg font-semibold transition-all duration-300 dark:border-slate-600 dark:hover:border-blue-500 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-300"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform text-blue-600 dark:text-blue-400" />
              Voir notre vidéo
            </Button>
          </MotionDiv>

          {/* Features */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: CheckCircle,
                title: 'Expertise 360°',
                description: 'Stratégie, création, développement et analytics'
              },
              {
                icon: CheckCircle,
                title: 'Solutions sur mesure',
                description: 'Approche personnalisée selon vos objectifs'
              },
              {
                icon: CheckCircle,
                title: 'Résultats mesurables',
                description: 'Suivi et optimisation en temps réel'
              }
            ].map((feature, index) => (
              <MotionDiv
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-800/60 dark:border-slate-700/20 dark:shadow-slate-900/20"
              >
                <feature.icon className="w-8 h-8 text-blue-600 mb-4 mx-auto dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2 dark:text-slate-200">{feature.title}</h3>
                <p className="text-slate-600 text-sm dark:text-slate-400">{feature.description}</p>
              </MotionDiv>
            ))}
          </MotionDiv>

          {/* Stats */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '500+', label: 'Projets réalisés', color: 'text-blue-600 dark:text-blue-400' },
              { number: '98%', label: 'Clients satisfaits', color: 'text-cyan-600 dark:text-cyan-400' },
              { number: '50+', label: 'Experts digitaux', color: 'text-slate-700 dark:text-slate-300' },
              { number: '24/7', label: 'Support client', color: 'text-green-600 dark:text-green-400' },
            ].map((stat, index) => (
              <MotionDiv
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                className="text-center"
              >
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                  {stat.number}
                </div>
                <div className="text-slate-600 text-sm md:text-base font-medium dark:text-slate-400">
                  {stat.label}
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </div>

      {/* Scroll Indicator */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <MotionDiv
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-slate-400/50 rounded-full flex justify-center bg-white/20 backdrop-blur-sm dark:border-slate-500/50 dark:bg-slate-800/20"
        >
          <MotionDiv
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-slate-600 rounded-full mt-2 dark:bg-slate-400"
          />
        </MotionDiv>
      </MotionDiv>
    </section>
  )
}
