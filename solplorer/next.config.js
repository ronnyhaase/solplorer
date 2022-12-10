/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
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
      'ckaumumkea.cloudimg.io',
    ],
  }
}

module.exports = nextConfig
