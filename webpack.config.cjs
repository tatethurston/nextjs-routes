const { join } = require("path");

const file = "config";

module.exports = {
  entry: `./src/${file}.ts`,
  target: "node",
  mode: "production",
  output: {
    filename: file + ".cjs",
    library: {
      type: "commonjs2",
      export: "default",
    },
    path: join(__dirname, "dist"),
  },
  externals: {
    chokidar: "commonjs chokidar",
  },
  resolve: {
    extensionAlias: {
      ".js": [".ts", ".js"],
    },
  },
  module: {
    rules: [
      {
        test: /\.(m|c)?tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              target: "es2020",
              parser: {
                syntax: "typescript",
              },
            },
          },
        },
      },
    ],
  },
};
