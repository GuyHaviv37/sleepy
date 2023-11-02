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
    remotePatterns: [{
      hostname: 'a.espncdn.com'
    }, {
      hostname: 'sleepercdn.com',
    }],
  },
});

module.exports = nextConfig;
