/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Optimize images
  images: {
    unoptimized: true,
    domains: ['localhost', 'via.placeholder.com'],
  },
  // Enable SWC minifier for better performance
  swcMinify: true,
}

module.exports = nextConfig
