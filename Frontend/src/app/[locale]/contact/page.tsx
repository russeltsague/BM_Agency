'use client'

import dynamic from 'next/dynamic'
import { motion, Variants } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

// Dynamically import components to avoid SSR issues
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false })

// Import Button component directly since it's already SSR compatible
import { Button } from '@/components/Button'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Star
} from 'lucide-react'

// Define form data type
interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  service: string
  message: string
}

export default function ContactPage() {
  const t = useTranslations('ContactPage')
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  // Set mounted state to handle SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Don't submit if not in browser
    if (typeof window === 'undefined') {
      toast.error(t('errors.tryAgainLater'))
      return
    }

    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const contactData: ContactFormData = {
      firstName: formData.get('firstName')?.toString() || '',
      lastName: formData.get('lastName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      company: formData.get('company')?.toString() || '',
      service: formData.get('service')?.toString() || '',
      message: formData.get('message')?.toString() || ''
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
        toast.success(t('success.messageSent'))
        e.currentTarget.reset()
      } else {
        const error = await response.json()
        toast.error(error.message || t('errors.sendError'))
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
        toast.success(t('success.newsletterSubscribed'))
        setNewsletterEmail('')
      } else {
        const error = await response.json()
        toast.error(error.message || t('errors.subscriptionError'))
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
      title: t('contactInfo.phone.title'),
      details: [t('contactInfo.phone.detail')],
      description: t('contactInfo.phone.description'),
      color: 'blue'
    },
    {
      icon: Mail,
      title: t('contactInfo.email.title'),
      details: [t('contactInfo.email.detail')],
      description: t('contactInfo.email.description'),
      color: 'green'
    },
    {
      icon: MapPin,
      title: t('contactInfo.address.title'),
      details: [t('contactInfo.address.detail')],
      description: t('contactInfo.address.description'),
      color: 'purple'
    },
    {
      icon: Clock,
      title: t('contactInfo.hours.title'),
      details: [t('contactInfo.hours.detail')],
      description: t('contactInfo.hours.description'),
      color: 'orange'
    }
  ]

  const faqs = [
    {
      question: t('faq.resultsTime.question'),
      answer: t('faq.resultsTime.answer')
    },
    {
      question: t('faq.customSolutions.question'),
      answer: t('faq.customSolutions.answer')
    },
    {
      question: t('faq.pricing.question'),
      answer: t('faq.pricing.answer')
    },
    {
      question: t('faq.companySizes.question'),
      answer: t('faq.companySizes.answer')
    }
  ]

  const testimonials = [
    {
      name: t('testimonials.one.name'),
      company: t('testimonials.one.company'),
      content: t('testimonials.one.content'),
      rating: 5
    },
    {
      name: t('testimonials.two.name'),
      company: t('testimonials.two.company'),
      content: t('testimonials.two.content'),
      rating: 5
    }
  ]

  // Don't render anything during SSR to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navbar is included in the layout */}

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
              {t.rich('hero.title', {
                highlight: (chunks) => <span className="text-primary-600 dark:text-blue-400">{chunks}</span>
              })}
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
              {t('hero.subtitle')}
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
                  {t('form.title')}
                </h2>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        {t('form.firstName')} *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                        placeholder={t('form.placeholders.firstName')}
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        {t('form.lastName')} *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                        placeholder={t('form.placeholders.lastName')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {t('form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                      placeholder={t('form.placeholders.email')}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {t('form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                      placeholder={t('form.placeholders.phone')}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {t('form.company')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                      placeholder={t('form.placeholders.company')}
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {t('form.service')}
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    >
                      <option value="">{t('form.placeholders.service')}</option>
                      <option value="digital">{t('form.services.digital')}</option>
                      <option value="marketing">{t('form.services.marketing')}</option>
                      <option value="design">{t('form.services.design')}</option>
                      <option value="strategy">{t('form.services.strategy')}</option>
                      <option value="objects">{t('form.services.objects')}</option>
                      <option value="training">{t('form.services.training')}</option>
                      <option value="other">{t('form.services.other')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {t('form.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors resize-none bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                      placeholder={t('form.placeholders.message')}
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
                      {t.rich('form.privacy', {
                        privacyLink: (chunks) => (
                          <a href="/politique-confidentialite" className="text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300">
                            {chunks}
                          </a>
                        )
                      })}
                    </label>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('form.submitting')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
                        {t('form.submit')}
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
                  <p className="text-lg font-medium">{t('map.title')}</p>
                  <p className="text-sm">{t('map.address')}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-primary-600 dark:bg-blue-600 text-white rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{t('quickQuote.title')}</h3>
                <p className="text-primary-100 dark:text-blue-100 mb-4">
                  {t('quickQuote.description')}
                </p>
                <Button variant="secondary" size="sm">
                  {t('quickQuote.button')}
                </Button>
              </div>

              {/* Testimonials */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  {t('testimonials.title')}
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
              {t('faq.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400">
              {t('faq.subtitle')}
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
              {t('newsletter.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 mb-8">
              {t('newsletter.subtitle')}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                required
              />
              <Button type="submit" disabled={isSubscribing} className="whitespace-nowrap">
                {isSubscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('newsletter.subscribing')}
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 w-4 h-4" />
                    {t('newsletter.subscribe')}
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer is included in the layout */}
    </main>
  )
}
