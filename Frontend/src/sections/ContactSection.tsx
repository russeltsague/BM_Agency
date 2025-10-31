'use client'

import React from 'react'
import { MotionDiv } from '@/components/MotionComponents'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { Button } from '@/components/Button'
import { useTranslations } from 'next-intl'

export const ContactSection = () => {
  const t = useTranslations('ContactSection')
  
  const contactInfo = [
    {
      icon: Phone,
      title: t('contactInfo.phone.title'),
      details: [t('contactInfo.phone.detail')],
      description: t('contactInfo.phone.description')
    },
    {
      icon: Mail,
      title: t('contactInfo.email.title'),
      details: [t('contactInfo.email.detail')],
      description: t('contactInfo.email.description')
    },
    {
      icon: MapPin,
      title: t('contactInfo.address.title'),
      details: [t('contactInfo.address.detail')],
      description: t('contactInfo.address.description')
    },
    {
      icon: Clock,
      title: t('contactInfo.hours.title'),
      details: [t('contactInfo.hours.detail')],
      description: t('contactInfo.hours.description')
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
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            {t('subtitle')}
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
                {t('contactInfo.title')}
              </h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {t('form.firstName.label')} *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                      placeholder={t('form.firstName.placeholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {t('form.lastName.label')} *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                      placeholder={t('form.lastName.placeholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('form.email.label')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    placeholder={t('form.email.placeholder')}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('form.phone.label')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    placeholder={t('form.phone.placeholder')}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('form.company.label')}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    placeholder={t('form.company.placeholder')}
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('form.service.label')}
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                  >
                    <option value="">{t('form.service.options.choose')}</option>
                    <option value="digital">{t('form.service.options.digital')}</option>
                    <option value="marketing">{t('form.service.options.marketing')}</option>
                    <option value="design">{t('form.service.options.design')}</option>
                    <option value="strategy">{t('form.service.options.strategy')}</option>
                    <option value="objects">{t('form.service.options.objects')}</option>
                    <option value="training">{t('form.service.options.training')}</option>
                    <option value="other">{t('form.service.options.other')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('form.message.label')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors resize-none bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    placeholder={t('form.message.placeholder')}
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
                    {(() => {
                      const privacyText = t('form.privacy', {
                        privacy: t('form.privacyLink')
                      });
                      const parts = privacyText.split('{privacy}');
                      
                      return parts.map((part, i) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < parts.length - 1 && (
                            <a href="/politique-confidentialite" className="text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300">
                              {t('form.privacyLink')}
                            </a>
                          )}
                        </React.Fragment>
                      ));
                    })()}
                  </label>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2 w-5 h-5" />
                  {t('form.submit')}
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
                    <span className="sr-only">{t('social.facebook')}</span>
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
              <p className="text-gray-600 dark:text-slate-400 mb-8">
                {t('contactInfo.description')}
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
