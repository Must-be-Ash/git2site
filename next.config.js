/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app'
      },
      {
        protocol: 'https',
        hostname: 'vercel.app'
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app'
      },
      {
        protocol: 'https',
        hostname: 'api.microlink.io'
      },
      {
        protocol: 'https',
        hostname: '*.microlink.io'
      },
      {
        protocol: 'https',
        hostname: 'api.urlbox.io',
      },
      {
        protocol: 'https',
        hostname: '*.urlbox.io',
      }
    ],
    // Allow domains with dynamic subdomains
    domains: ['vercel.app'],
  },
  output: 'standalone',
};

module.exports = nextConfig;
