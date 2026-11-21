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
    // Serve images as-is instead of through Vercel's Image Optimization,
    // which has usage limits and costs (#215). With this on, any future
    // `next/image` <Image> still works but renders a plain <img> with the
    // original src, so it can't start using the optimizer again by accident.
    // Keep files in /public small: resize and compress them before committing.
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
