'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

// Dynamically import components with SSR disabled
const Navbar = dynamic(() => import('@/components/Navbar').then(mod => mod.default), { ssr: false});
const Button = dynamic(() => import('@/components/Button').then(mod => mod.Button), { ssr: false});
const MotionDiv = dynamic(() => import('@/components/MotionComponents').then(mod => mod.MotionDiv), { ssr: false});
const MotionH2 = dynamic(() => import('@/components/MotionComponents').then(mod => mod.MotionH2), { ssr: false});

import { Users, Calendar, Mail, CheckCircle } from 'lucide-react'
import { teamAPI } from '@/lib/api'

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  achievements: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AgencyPage() {
  const t = useTranslations('AgencyPage')
  
  const { data: teamMembers = [], isLoading, error } = useQuery<TeamMember[]>({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const response = await teamAPI.getAll();
      return response?.data || [];
    },
  });

  // Get milestones from translations
  const milestones = [
    { year: '2018', event: t('milestones.2018') },
    { year: '2019', event: t('milestones.2019') },
    { year: '2020', event: t('milestones.2020') },
    { year: '2021', event: t('milestones.2021') },
    { year: '2022', event: t('milestones.2022') },
    { year: '2023', event: t('milestones.2023') },
    { year: '2024', event: t('milestones.2024') }
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
              {t('hero.titleHighlight')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
              {t('hero.description')}
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <MotionDiv
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <MotionH2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                {t('story.title')}
              </MotionH2>
              <div className="space-y-6 text-gray-600 dark:text-slate-400">
                <p>{t('story.paragraph1')}</p>
                <p>{t('story.paragraph2')}</p>
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
                    <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">{t('stats.projects')}</div>
                    <div className="text-gray-600 dark:text-slate-400">{t('stats.projectsLabel')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">{t('stats.satisfaction')}</div>
                    <div className="text-gray-600 dark:text-slate-400">{t('stats.satisfactionLabel')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">{t('stats.experts')}</div>
                    <div className="text-gray-600 dark:text-slate-400">{t('stats.expertsLabel')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">{t('stats.years')}</div>
                    <div className="text-gray-600 dark:text-slate-400">{t('stats.yearsLabel')}</div>
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
              {t('values.title')}
            </MotionH2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('values.subtitle')}
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
                {t('vision.title')}
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                {t('vision.description')}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">{t('stats.projects')}</div>
                  <div className="text-gray-600 dark:text-slate-400">{t('stats.projectsLabel')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-blue-400 mb-2">{t('stats.satisfaction')}</div>
                  <div className="text-gray-600 dark:text-slate-400">{t('stats.satisfactionLabel')}</div>
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
                {t('team.title')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
                {t('team.subtitle')}
              </p>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              {t('team.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('team.subtitle')}
            </p>
          </MotionDiv>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <MotionDiv
                  key={member._id || index}
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
                    {member.achievements?.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center text-xs text-gray-500 dark:text-slate-400">
                        <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                        {achievement}
                      </div>
                    ))}
                  </div>
                </MotionDiv>
              ))}
            </div>
          )}
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
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                {t('timeline.title')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
                {t('timeline.subtitle')}
              </p>
            </div>
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
              {t('cta.title')}
            </h2>
            <p className="text-xl text-primary-100 dark:text-blue-100 mb-8 max-w-3xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Calendar className="mr-2 w-5 h-5" />
                {t('cta.jobOffers')}
              </Button>
              <Button variant="outline" size="lg">
                {t('cta.spontaneous')}
              </Button>
            </div>
          </MotionDiv>
        </div>
      </section>

    </main>
  )
}
