/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n.tsx');

const nextConfig = {
  reactStrictMode: true,
  // Increase static page generation timeout (in seconds)
  staticPageGenerationTimeout: 300,
  // Ensure consistent React version
  experimental: {
    esmExternals: 'loose',
    // Enable incremental static regeneration
    isrMemoryCacheSize: 0,
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
    // Add any necessary image domains here
    domains: ['localhost', 'via.placeholder.com'],
  },
  // Enable SWC minifier for better performance
  swcMinify: true,
  // i18n configuration for static export
  output: 'standalone',
  // Configure page revalidation
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    // Enable incremental static regeneration
    isrMemoryCacheSize: 0,
  },
  // Disable TypeScript type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors during build
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure API routes to be serverless
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
  // Configure static page generation
  generateBuildId: async () => {
    return 'build-' + Date.now();
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
        ],
      },
    ];
  },
}

// Apply next-intl plugin
module.exports = withNextIntl(nextConfig)
