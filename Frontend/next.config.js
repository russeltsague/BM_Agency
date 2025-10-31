/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n.tsx');

const nextConfig = {
  reactStrictMode: true,
  // Ensure consistent React version
  experimental: {
    esmExternals: 'loose',
  },
  // Handle file uploads
  webpack: (config) => {
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
  // Disable server components external packages
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // Disable TypeScript type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: false,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

// Apply next-intl plugin
module.exports = withNextIntl(nextConfig)
