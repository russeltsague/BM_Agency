'use client'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Star
} from 'lucide-react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const contactData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      service: formData.get('service') as string,
      message: formData.get('message') as string,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })
      if (response.ok) {
        toast.success('Message envoyé avec succès ! Nous vous répondrons sous 24h.')
        e.currentTarget.reset()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de l\'envoi du message')
      }
    } catch {
      toast.error('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubscribing(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      if (response.ok) {
        toast.success('Merci pour votre inscription à notre newsletter !')
        setNewsletterEmail('')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de l\'inscription')
      }
    } catch {
      toast.error('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsSubscribing(false)
    }
  }
  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+237 675 176 974', '+237 222 123 457'],
      description: 'Nos conseillers sont disponibles du lundi au vendredi de 8h à 17h',
      color: 'blue'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@bm-agency.net', 'devis@bm-agency.net'],
      description: 'Réponse garantie sous 24h pour les demandes de devis',
      color: 'green'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['11595 Yaoundé-Kondengui', 'BP 12345 Yaoundé, Cameroun'],
      description: 'Situé au cœur de Yaoundé pour mieux vous servir',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: ['Lundi - Vendredi: 8h - 17h', 'Samedi: 8h - 12h', 'Dimanche: Fermé'],
      description: 'Accueil téléphonique et physique pendant les heures d\'ouverture',
      color: 'orange'
    }
  ]

  const faqs = [
    {
      question: 'Combien de temps faut-il pour voir les résultats ?',
      answer: 'Selon les services, les premiers résultats sont visibles entre 1 et 6 mois. Nous établissons un calendrier précis lors de notre première consultation.'
    },
    {
      question: 'Proposez-vous des formules sur mesure ?',
      answer: 'Absolument ! Chaque entreprise est unique, c\'est pourquoi nous créons des solutions personnalisées adaptées à vos besoins et votre budget.'
    },
    {
      question: 'Quels sont vos tarifs ?',
      answer: 'Nos tarifs varient selon la complexité du projet. Nous proposons des devis gratuits et transparents après une première consultation.'
    },
    {
      question: 'Travaillez-vous avec des entreprises de toutes tailles ?',
      answer: 'Oui, nous accompagnons aussi bien les startups que les grandes entreprises, avec des solutions adaptées à chaque structure.'
    }
  ]

  const testimonials = [
    {
      name: 'Jean-Paul Nguema',
      company: 'Cameroun Télécom',
      content: 'BM Agency a complètement transformé notre présence digitale. Leur expertise et leur professionnalisme sont exceptionnels.',
      rating: 5
    },
    {
      name: 'Fatima Mbarga',
      company: 'Fashion Africa Group',
      content: 'L\'équipe de BM Agency comprend parfaitement les spécificités du marché camerounais. Résultats au-delà de nos attentes.',
      rating: 5
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
              Contactez <span className="text-primary-600 dark:text-blue-400"> BM Agency</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
              Prêt à donner un coup d&apos;accélérateur à votre présence digitale ?
              Nos experts vous accompagnent pour transformer vos idées en succès.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100 dark:border-slate-700"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  info.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  info.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                  info.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  <info.icon className={`w-8 h-8 ${
                    info.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    info.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    info.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`} />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
                  {info.title}
                </h3>

                <div className="space-y-1 mb-3">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-700 dark:text-slate-300 font-medium">
                      {detail}
                    </p>
                  ))}
                </div>

                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-8 border border-gray-100 dark:border-slate-700">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
                  Envoyez-nous un message
                </h2>

                <form onSubmit={handleContactSubmit} className="space-y-6">
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
                      placeholder="votre.email@exemple.com"
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
                      id="privacy"
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

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Map & Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <div className="bg-gray-200 dark:bg-slate-700 rounded-xl h-64 flex items-center justify-center border border-gray-100 dark:border-slate-600">
                <div className="text-center text-gray-500 dark:text-slate-400">
                  <MapPin className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">Carte interactive</p>
                  <p className="text-sm">11595 Yaoundé-Kondengui, Cameroun</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-primary-600 dark:bg-blue-600 text-white rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Besoin d&apos;un devis rapide ?</h3>
                <p className="text-primary-100 dark:text-blue-100 mb-4">
                  Obtenez une estimation gratuite en moins de 24h
                </p>
                <Button variant="secondary" size="sm">
                  Devis express
                </Button>
              </div>

              {/* Testimonials */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Ils nous font confiance
                </h3>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-slate-300 text-sm mb-2">&quot;{testimonial.content}&quot;</p>
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                      <strong>{testimonial.name}</strong> - {testimonial.company}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400">
              Trouvez rapidement les réponses à vos questions les plus courantes.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              Restez informé
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 mb-8">
              Recevez nos dernières actualités, conseils et offres exclusives directement dans votre boîte mail.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                required
              />
              <Button type="submit" disabled={isSubscribing} className="whitespace-nowrap">
                {isSubscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Inscription...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 w-4 h-4" />
                    S&apos;abonner
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
