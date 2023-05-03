import nextRoutes from "nextjs-routes/config";

const withRoutes = nextRoutes();

const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
};

export default withRoutes(nextConfig);
