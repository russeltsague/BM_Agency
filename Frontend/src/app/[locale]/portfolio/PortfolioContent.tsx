'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ExternalLink, Eye, Calendar, Filter, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/Button';

// Define Realisation type
export interface Realisation {
  _id: string;
  title: string;
  description: Record<string, string> | string;
  image?: string;
  category: string;
  tags?: string[];
  client?: string;
  url?: string;
  githubUrl?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  technologies?: string[];
}

type Category = 'all' | 'web' | 'mobile' | 'design' | 'ecommerce';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// API client for fetching realisations
const fetchRealisations = async (): Promise<Realisation[]> => {
  try {
    const response = await fetch('/api/realisations');
    if (!response.ok) {
      throw new Error('Failed to fetch realisations');
    }
    const result = await response.json();
    
    if (!result || !Array.isArray(result.data)) {
      throw new Error('Invalid response format from API');
    }

    return result.data
      .filter((item: any) => isRealisation(item))
      .map((item: any) => ({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags : [],
        category: item.category || 'Uncategorized',
        description: item.description || ''
      }));
  } catch (error) {
    console.error('Error fetching realisations:', error);
    throw error;
  }
};

// Type guard to check if an object is a valid Realisation
const isRealisation = (item: any): item is Realisation => {
  return (
    item &&
    typeof item === 'object' &&
    'title' in item &&
    'category' in item
  );
};

// Define the translation type for the PortfolioView component
interface PortfolioTranslations {
  title: string;
  subtitle: string;
  all: string;
  viewProject: string;
  liveDemo: string;
  viewCode: string;
  loading: string;
  error: string;
  noProjects?: string;
}

// View component that doesn't handle data fetching
function PortfolioView({ 
  realisations, 
  categories, 
  selectedCategory, 
  onCategoryChange,
  t: translations, // Pass the translations object as t prop
  currentLocale
}: { 
  realisations: Realisation[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: Category) => void;
  t: PortfolioTranslations; // This is the translations object
  currentLocale: string;
}) {
  // Helper function to safely get translation with HTML
  const getTranslatedTitle = () => {
    // Get the title from translations, default to empty string if not found
    const title = translations.title || '';
    
    // If the title contains HTML tags, process them
    if (typeof title === 'string') {
      return title
        .replace(/<1>(.*?)<\/1>/g, '<span class="text-primary-600 dark:text-blue-400">$1</span>');
    }
    
    return title;
  };
  
  // Use translations object directly
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-8 pb-16 bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-6"
            dangerouslySetInnerHTML={{ __html: translations.title.replace(/<1>(.*?)<\/1>/g, '<span class="text-primary-600 dark:text-blue-400">$1</span>') }}
          />
          <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
            {translations.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category.toLowerCase() === selectedCategory ? 'primary' : 'outline'}
                size="sm"
                className="mb-2"
                onClick={() => {
                  const cat = (category === 'all' ? 'all' : 
                    ['web', 'mobile', 'design', 'ecommerce'].includes(category.toLowerCase()) 
                      ? category.toLowerCase() as Category 
                      : 'all');
                  onCategoryChange(cat);
                }}
              >
                <Filter className="w-4 h-4 mr-1" />
                {category === 'all' ? translations.all : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {realisations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{translations.error}</p>
              </div>
            ) : realisations.map((realisation) => (
              <motion.div
                key={realisation._id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-slate-700 overflow-hidden">
                  {realisation.image ? (
                    <Image
                      src={realisation.image}
                      alt={realisation.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                      <div className="text-6xl text-primary-300 dark:text-blue-400">
                        {translations.liveDemo === 'E-commerce' && '🛒'}
                        {translations.liveDemo === 'Application Mobile' && '📱'}
                        {translations.liveDemo === 'Site Web' && '🌐'}
                        {translations.liveDemo === 'SaaS' && '☁️'}
                        {translations.liveDemo === 'Marketing Digital' && '📢'}
                        {translations.liveDemo === 'Branding' && '🎨'}
                      </div>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {realisation.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 dark:bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {translations.liveDemo}
                    </h3>
                    <div className="flex space-x-2 mt-4">
                      {realisation.url && (
                        <a
                          href={realisation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          {translations.viewProject}
                        </a>
                      )}
                      {realisation.githubUrl && (
                        <a
                          href={realisation.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          View Code
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Eye className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">{translations.viewProject}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(realisation.createdAt).toLocaleDateString(currentLocale, {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </div>
                    <span className="mx-2">•</span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full dark:bg-primary-900/30 dark:text-primary-300">
                      {translations.liveDemo}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {typeof realisation.description === 'string' 
                      ? realisation.description 
                      : realisation.description?.fr || ''}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {realisation.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              {translations.all} {translations.viewProject}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Main component that handles data fetching
export default function PortfolioContent() {
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const t = useTranslations('PortfolioPage');
  const currentLocale = useLocale();

  useEffect(() => {
    const loadRealisations = async () => {
      try {
        setLoading(true);
        const data = await fetchRealisations();
        setRealisations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadRealisations();
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
              Error
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800/80 text-red-700 dark:text-red-200 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get unique categories and ensure they are valid
  const categories = ['all' as const, ...new Set(
    realisations
      .map(r => (r.category || '').toLowerCase())
      .filter((category): category is string => !!category)
  )];
  
  // Filter realisations by selected category
  const filteredRealisations = selectedCategory === 'all'
    ? realisations 
    : realisations.filter(r => r.category?.toLowerCase() === selectedCategory.toLowerCase());

  // Create translations object with all required fields
  const translations: PortfolioTranslations = {
    title: t('title'),
    subtitle: t('subtitle'),
    all: t('all'),
    viewProject: t('viewProject'),
    liveDemo: t('liveDemo'),
    viewCode: t('viewCode'),
    loading: t('loading'),
    error: t('error'),
    noProjects: t('noProjects', { defaultValue: 'No projects available' })
  };

  return (
    <PortfolioView 
      realisations={filteredRealisations}
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      t={translations}
      currentLocale={currentLocale}
    />
  );
}
