// eslint-disable-next-line
const { resolve } = require("path");

// eslint-disable-next-line no-undef
module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  output: {
    // eslint-disable-next-line no-undef
    path: resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
