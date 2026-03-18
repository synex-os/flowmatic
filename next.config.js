/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Cloudflare Pages compatible
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig
