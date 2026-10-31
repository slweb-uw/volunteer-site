/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Serve images as-is instead of through Vercel's Image Optimization (#215)
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/opportunities",
        destination: "/opportunities/default",
      },
    ]
  },
}

const withAnalyzer = require("@next/bundle-analyzer")()

module.exports =
  process.env.ANALYZE === "true" ? withAnalyzer(nextConfig) : nextConfig
