/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  images: {
    remotePatterns: [
      { hostname: 'hone1er.eth.limo' },
      { hostname: 'ipfs.io' },
      { hostname: 'gateway.pinata.cloud' },
      { hostname: 'i.imgur.com' },
      { hostname: 'lh3.googleusercontent' },
      { hostname: 'cdn.discordapp.com' },
      { hostname: 'cdn.discordapp.com' },
    ],
  },
}

module.exports = nextConfig
