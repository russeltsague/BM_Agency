'use client';

import { useQuery } from '@tanstack/react-query';
import { servicesAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const iconMap: Record<string, string> = {
  Megaphone: '📢',
  Smartphone: '📱',
  Palette: '🎨',
  TrendingUp: '📈',
  ShoppingBag: '🛍️',
  Users: '👥',
};

export function ServicesList() {
  const t = useTranslations('Services');
  const { data: services, isLoading, error, refetch } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await servicesAPI.getAll();
      return response?.data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {t('error')}: {error instanceof Error ? error.message : 'Failed to load services'}
          </p>
          <Button onClick={() => refetch()}>{t('retry')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {services?.map((service: any) => (
        <motion.div
          key={service._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl mb-4">
              {iconMap[service.icon as keyof typeof iconMap] || '✨'}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {service.title}
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-4">{service.description}</p>
            <ul className="space-y-2 mb-6">
              {service.features?.map((feature: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full">{t('learnMore')}</Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
