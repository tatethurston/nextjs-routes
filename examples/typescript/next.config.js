/** @type {import('next').NextConfig} */
const { withRoutes } = require("nextjs-routes/next-config.cjs");

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withRoutes(nextConfig);
