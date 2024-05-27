import nextRoutes from "nextjs-routes/config";

const withRoutes = nextRoutes();

const nextConfig = {
  reactStrictMode: true,
};

export default withRoutes(nextConfig);
