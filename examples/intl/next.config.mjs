import nextRoutes from "nextjs-routes/config";

const withRoutes = nextRoutes();

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en-US", "fr", "nl-NL"],
    defaultLocale: "en-US",
  },
};

export default withRoutes(nextConfig);
