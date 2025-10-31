'use client'

import { ArrowRight, CheckCircle, MessageCircle } from 'lucide-react'
import { Button } from '@/components/Button'
import { useState, useEffect } from 'react'
import { useSafeTranslations } from '@/hooks/useSafeTranslations'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  images?: string[]
  interval?: number
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  interval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const t = useSafeTranslations('HeroSection')
  
  // Image paths from the public directory
  const heroImages = [
    '/images/hero-1.jpg',
    '/images/hero-2.jpg',
    '/images/hero-3.jpg',
    '/images/hero-4.jpg',
    '/images/hero-5.jpg',
    '/images/hero-6.jpg',
    '/images/hero-7.jpg',
    '/images/hero-8.jpg',
    '/images/hero-9.jpg',
    '/images/hero-10.jpg',
    '/images/hero-11.jpg',
    '/images/hero-12.jpg',
    '/images/hero-13.jpg',
    '/images/hero-14.jpg'
  ]
  
  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-slate-900">
      {/* Background Images */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.map((src, index) => (
          <div 
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={src}
              alt={`Hero image ${index + 1}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-900/80 dark:from-slate-900/50 dark:via-slate-900/30 dark:to-slate-900/60"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => window.open('https://wa.me/237675176974', '_blank')}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-8"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t('whatsapp')}</span>
            </button>

            <div className="relative mb-8 text-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
                <span className="relative inline-block">
                  <span className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-2xl -rotate-2 blur-md"></span>
                  <span className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent dark:from-slate-100 dark:via-blue-100 dark:to-slate-200">
                    {t('title1')}
                  </span>
                </span>
                <br />
                <span className="relative inline-block mt-2 md:mt-4">
                  <span className="absolute -inset-3 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-xl rotate-1 blur"></span>
                  <span className="relative bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-400 dark:to-blue-500">
                    {t('title2')}
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                  </span>
                </span>
              </h1>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-70"></div>
            </div>

            <div className="relative inline-block mb-12">
              <p className="text-xl md:text-2xl font-semibold text-white dark:text-slate-400 max-w-4xl mx-auto leading-relaxed relative z-10 px-6 py-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl">
                <span className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"></span>
                {t('description')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              onClick={() => window.open('https://wa.me/237675176974?text=Bonjour,%20je%20souhaite%20demander%20un%20devis%20gratuit%20pour%20mon%20projet.', '_blank')}
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600"
            >
              {t('cta')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: CheckCircle,
                title: t('features.expertise.title'),
                description: t('features.expertise.description')
              },
              {
                icon: CheckCircle,
                title: t('features.solutions.title'),
                description: t('features.solutions.description')
              },
              {
                icon: CheckCircle,
                title: t('features.results.title'),
                description: t('features.results.description')
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-800/60 dark:border-slate-700/20 dark:shadow-slate-900/20"
              >
                <feature.icon className="w-8 h-8 text-blue-600 mb-4 mx-auto dark:text-blue-400" />
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('trustedBy')}</h3>
                <p className="text-slate-600 text-sm dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: t('stats.projects'), label: t('stats.projectsLabel'), color: 'text-blue-600 dark:text-blue-400' },
              { number: t('stats.satisfaction'), label: t('stats.satisfactionLabel'), color: 'text-cyan-600 dark:text-cyan-400' },
              { number: t('stats.experts'), label: t('stats.expertsLabel'), color: 'text-slate-700 dark:text-slate-300' },
              { number: '24/7', label: t('stats.supportLabel'), color: 'text-green-600 dark:text-green-400' },
            ].map((stat, index) => (
              <motion.div
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-slate-400/50 rounded-full flex justify-center bg-white/20 backdrop-blur-sm dark:border-slate-500/50 dark:bg-slate-800/20"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-slate-600 rounded-full mt-2 dark:bg-slate-400"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
