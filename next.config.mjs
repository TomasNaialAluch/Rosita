/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Solo usar export para builds de producción, no en desarrollo
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    distDir: 'dist'
  }),
  // Optimizaciones para desarrollo
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Mejorar compilación en desarrollo
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

export default nextConfig
