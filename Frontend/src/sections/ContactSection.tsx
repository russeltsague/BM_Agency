'use client'

import React from 'react'
import { MotionDiv } from '@/components/MotionComponents'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { Button } from '@/components/Button'

export const ContactSection = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+237 675176974'],
      description: 'Nos conseillers sont disponibles du lundi au vendredi'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@bm-agency.net'],
      description: 'Réponse sous 24h garantie'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['11595 Yaoundé-Kondengui'],
      description: 'Métro ligne 1 - Station Concorde'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: ['Lundi - Vendredi: 9h - 18h', 'Samedi: 9h - 12h'],
      description: 'Accueil téléphonique et physique'
    }
  ]

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            Contactez-nous
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            Prêt à démarrer votre projet digital ? Contactez notre équipe d&apos;experts
            pour une consultation gratuite et personnalisée.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <MotionDiv
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-8 border border-gray-100 dark:border-slate-700">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
                Envoyez-nous un message
              </h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                      placeholder="Votre prénom"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    placeholder="votre.email@exemple.fr"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    placeholder="01 23 45 67 89"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Service souhaité
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                  >
                    <option value="">Choisissez un service</option>
                    <option value="digital">Communication digitale</option>
                    <option value="marketing">Marketing digital</option>
                    <option value="design">Design & Branding</option>
                    <option value="strategy">Stratégie digitale</option>
                    <option value="objects">Objets publicitaires</option>
                    <option value="training">Formation & Coaching</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors resize-none bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    placeholder="Décrivez votre projet ou votre demande..."
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="privacy"
                    required
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600 dark:text-slate-400">
                    J&apos;accepte que mes données soient traitées conformément à la{' '}
                    <a href="/politique-confidentialite" className="text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300">
                      politique de confidentialité
                    </a>
                    *
                  </label>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2 w-5 h-5" />
                  Envoyer le message
                </Button>
              </form>
            </div>
          </MotionDiv>

          {/* Contact Info */}
          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <MotionDiv
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                    <info.icon className="w-6 h-6 text-primary-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-slate-100">{info.title}</h4>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-700 dark:text-slate-300 font-medium">
                      {detail}
                    </p>
                  ))}
                </div>

                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {info.description}
                </p>
              </MotionDiv>
            ))}

            {/* CTA */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-primary-600 dark:bg-blue-600 text-white rounded-xl p-6 text-center"
            >
              <h4 className="font-semibold mb-2">Besoin d&apos;un devis rapide ?</h4>
              <p className="text-primary-100 dark:text-blue-100 mb-4">
                Obtenez une estimation gratuite en moins de 24h
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Devis express
              </Button>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}
