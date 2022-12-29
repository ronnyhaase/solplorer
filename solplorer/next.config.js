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
    loader: 'custom',
    loaderFile: './src/loaders/image.js',
    domains: [
      'assets.coingecko.com',
      'icons.llama.fi',
      'ckaumumkea.cloudimg.io',
    ],
  }
}

module.exports = nextConfig
