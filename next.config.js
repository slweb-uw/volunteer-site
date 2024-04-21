module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "firebasestorage.googleapis.com"],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    config.module.rules.push({
      test: /\.svg$/,
      include: /\.(js|ts)x?$/,
      use: [{ loader: "@svgr/webpack" }, { loader: "url-loader" }],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/opportunities",
        destination: "/opportunities/default",
      },
    ];
  },
};
