/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  // Disable static optimization for better Vercel compatibility
  generateBuildId: async () => {
    return 'build-cache-' + Date.now()
  },
  // Enable hybrid rendering
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'supports-color': 'commonjs supports-color',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
  // Optimize images for Vercel
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  // Enable SWC minifier for better performance
  swcMinify: true,
}

module.exports = nextConfig
