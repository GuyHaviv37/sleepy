const withPWA = require("next-pwa")({
  dest: "public",
  // put other next-pwa options here
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development"
});

const nextConfig = withPWA({
  reactStrictMode: true,
  // put other next js options here
  swcMinify: true,
  images: {
    domains: ['a.espncdn.com', 'sleepercdn.com'],
  },
});

module.exports = nextConfig;
