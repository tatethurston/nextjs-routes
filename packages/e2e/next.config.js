const nextRoutes = require("nextjs-routes/config");

const withRoutes = nextRoutes();

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withRoutes(nextConfig);
