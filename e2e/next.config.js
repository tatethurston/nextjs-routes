const {withRoutes} = require("nextjs-routes/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withRoutes()(nextConfig);
