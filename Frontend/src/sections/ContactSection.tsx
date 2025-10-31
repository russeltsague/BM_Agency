'use client'

import React, { useState } from 'react'
import { MotionDiv } from '@/components/MotionComponents'
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/Button'
import { useTranslations } from 'next-intl'
import { useForm, SubmitHandler } from 'react-hook-form'

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  privacy: boolean;
};

export const ContactSection = () => {
  const t = useTranslations('ContactSection')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: t('form.successMessage')
        });
        reset();
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : t('form.errorMessage')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset status after 5 seconds
  React.useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);
  
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

  const handleWhatsAppClick = () => {
    const phoneNumber = '237675176974';
    const message = encodeURIComponent("Bonjour, je souhaite obtenir un devis express pour mes besoins en communication digitale.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {t('form.firstName.label')} *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className={`w-full px-4 py-3 border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                      } rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100`}
                      placeholder={t('form.firstName.placeholder')}
                      {...register('firstName', { required: t('form.required') })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {t('form.lastName.label')} *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className={`w-full px-4 py-3 border ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                      } rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100`}
                      placeholder={t('form.lastName.placeholder')}
                      {...register('lastName', { required: t('form.required') })}
                      disabled={isSubmitting}
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
                    className={`w-full px-4 py-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    } rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100`}
                    placeholder={t('form.email.placeholder')}
                    {...register('email', { 
                      required: t('form.required'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('form.invalidEmail')
                      }
                    })}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('form.phone.label')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    placeholder={t('form.phone.placeholder')}
                    {...register('phone')}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('form.company.label')}
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    placeholder={t('form.company.placeholder')}
                    {...register('company')}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('form.service.label')}
                  </label>
                  <select
                    id="service"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    {...register('service')}
                    disabled={isSubmitting}
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
                    rows={5}
                    className={`w-full px-4 py-3 border ${
                      errors.message ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    } rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-400 focus:border-primary-500 dark:focus:border-blue-400 transition-colors resize-none bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100`}
                    placeholder={t('form.message.placeholder')}
                    {...register('message', { required: t('form.required') })}
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy"
                    className={`mt-1 mr-3 ${errors.privacy ? 'border-red-500' : ''}`}
                    {...register('privacy', { required: t('form.privacyRequired') })}
                    disabled={isSubmitting}
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

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('form.submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-5 h-5" />
                      {t('form.submit')}
                    </>
                  )}
                </Button>
                
                {submitStatus && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    submitStatus.success 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    <div className="flex items-center">
                      {submitStatus.success ? (
                        <CheckCircle className="h-5 w-5 mr-2" />
                      ) : (
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span>{submitStatus.message}</span>
                    </div>
                  </div>
                )}
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
              <h4 className="font-semibold mb-2">Besoin d'un devis rapide ?</h4>
              <p className="text-gray-600 dark:text-slate-400 mb-8">
                {t('contactInfo.description')}
              </p>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={handleWhatsAppClick}
              >
                Devis express
              </Button>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}
