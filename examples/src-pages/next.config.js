const { withRoutes } = require("nextjs-routes/next-config.cjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withRoutes(nextConfig);
