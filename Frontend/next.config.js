/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n.tsx');

const nextConfig = {
  reactStrictMode: true,
  // Disable static page generation timeout for Vercel
  staticPageGenerationTimeout: 0,
  
  // Disable static optimization for all pages
  output: 'standalone',
  
  // Disable static optimization for all pages
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    // Disable static optimization
    isrMemoryCacheSize: 0,
    // Disable static pages
    staticPageGeneration: {
      maxConcurrentGenerations: 1,
      concurrency: 1
    },
    // Disable static optimization
    optimizeCss: false,
    // Disable static optimization
    optimizeFonts: false,
    // Disable static optimization
    optimizeImages: false,
  },
  
  // Handle file uploads
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'supports-color': 'commonjs supports-color',
      'bufferutil': 'commonjs bufferutil',
    });

    // Ensure JSON files are properly loaded
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });

    return config;
  },
  
  // Optimize images
  images: {
    unoptimized: true,
    domains: ['localhost', 'via.placeholder.com'],
  },
  
  // Enable SWC minifier for better performance
  swcMinify: true,
  
  // Output standalone for better compatibility
  output: 'standalone',
  
  // Configure server components
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    // Enable incremental static regeneration
    isrMemoryCacheSize: 0,
  },
  
  // Disable TypeScript type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Add cache control for dynamic routes
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Configure build output
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
  // Disable static optimization for all pages
  generateEtags: false,
}

// Apply next-intl plugin
module.exports = withNextIntl(nextConfig)
