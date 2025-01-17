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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      },
    ],
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
