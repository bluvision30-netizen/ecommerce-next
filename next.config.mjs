/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Fake Store API
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        pathname: '/img/**',
      },
      // Autres domaines que vous pourriez utiliser
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    // Qualité d'image par défaut
    quality: 80,
    // Formats supportés
    formats: ['image/webp', 'image/avif'],
  },
  
  // Autres optimisations
  compiler: {
    // Supprime les console.log en production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Activation de SWC minify
  swcMinify: true,
}

module.exports = nextConfig