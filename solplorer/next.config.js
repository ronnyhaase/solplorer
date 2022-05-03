/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: {
      layoutRaw: true,
    },
    outputStandalone: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      }
    ]
  },
  images: {
    domains: [
      'assets.coingecko.com',
      'icons.llama.fi',
    ],
  }
}

module.exports = nextConfig
