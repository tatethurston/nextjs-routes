const nextRoutes = require("nextjs-routes/config");

const withRoutes = nextRoutes({
  // optional configuration: this will put the generated types in a types folder instead of at the project root.
  outDir: "types",
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withRoutes(nextConfig);
