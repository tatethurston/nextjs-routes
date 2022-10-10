import withRoutes from "nextjs-routes/config";

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en-US", "fr", "nl-NL"],
    defaultLocale: "en-US",
  },
};

export default withRoutes()(nextConfig);
