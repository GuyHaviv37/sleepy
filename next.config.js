const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development"
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['a.espncdn.com', 'sleepercdn.com'],
  },
  experimental: {
    nextScriptWorkers: true,
  },
});

module.exports = nextConfig;
