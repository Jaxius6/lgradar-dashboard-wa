/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  images: {
    domains: ['memlxbsitkqvgitjubfo.supabase.co'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/gazettes',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;