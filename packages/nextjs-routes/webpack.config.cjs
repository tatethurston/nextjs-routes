// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { join } = require("path");

/**
 * @type {import('webpack').Configuration}
 */
const common = {
  mode: "production",
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

// eslint-disable-next-line no-undef
module.exports = [
  {
    ...common,
    target: "node",
    entry: {
      index: "./src/config.ts",
    },
    output: {
      filename: "config.cjs",
      // eslint-disable-next-line no-undef
      path: join(__dirname, "dist"),
      library: {
        type: "commonjs2",
        export: "default",
      },
    },
    externals: {
      chokidar: "chokidar",
    },
    externalsPresets: {
      node: true,
    },
  },
  {
    ...common,
    target: "node",
    entry: {
      index: "./src/index.ts",
    },
    output: {
      filename: "index.cjs",
      // eslint-disable-next-line no-undef
      path: join(__dirname, "dist"),
      libraryTarget: "commonjs2",
    },
  },
];
