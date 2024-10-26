/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      // Add other domains as needed
    ],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  output: 'standalone',
};

module.exports = nextConfig;
