/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['picsum.photos'],
  },
  typescript: {
    // Temporariamente ignorar erros de tipo durante o desenvolvimento
    ignoreBuildErrors: false,
  },
  eslint: {
    // Temporariamente ignorar erros de ESLint durante o desenvolvimento
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
