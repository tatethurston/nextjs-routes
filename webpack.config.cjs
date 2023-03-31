const { join } = require("path");

/**
 * @type {import('webpack').Configuration}
 */
const common = {
  target: "node",
  mode: "production",
  output: {
    filename: "[name].cjs",
    path: join(__dirname, "dist"),
    libraryTarget: "commonjs2",
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

module.exports = [
  {
    ...common,
    entry: {
      config: "./src/config.ts",
    },
    externals: {
      chokidar: "commonjs chokidar",
    },
    output: {
      ...common.output,
      // set default export to module.exports
      library: {
        type: "commonjs2",
        export: "default",
      },
    },
  },
  {
    ...common,
    entry: {
      index: "./src/index.ts",
    },
  },
];
