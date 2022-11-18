const withRoutes = require("nextjs-routes/config")();

const nextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withRoutes(nextConfig);
