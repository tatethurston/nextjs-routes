const {withRoutes} = require("nextjs-routes/config");

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withRoutes({
  // optional configuration: this will put the generated types in a types folder instead of at the project root.
  outDir: "types",
})(nextConfig);
