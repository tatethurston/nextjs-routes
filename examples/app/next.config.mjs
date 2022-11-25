import withRoutes from "nextjs-routes/config";

const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
};

export default withRoutes()(nextConfig);
