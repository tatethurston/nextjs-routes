/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextConfig } from "next";
import { join } from "path";
import type { Configuration, WebpackPluginInstance } from "webpack";
import { getAppDirectory, getPagesDirectory } from "./utils.js";
import { watch } from "chokidar";
import { logger, writeNextjsRoutes } from "./core.js";

function debounce<Fn extends (...args: unknown[]) => unknown>(
  fn: Fn,
  ms: number
): (...args: Parameters<Fn>) => void {
  let id: NodeJS.Timeout;
  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}

interface NextJSRoutesPluginOptions extends WithRoutesOptions {
  watch: boolean;

  /**
   * If you are getting the `Could not find a Next.js pages directory` error,
   * try passing `cwd: __dirname` from your `next.config.js`.
   */
  cwd?: string;
}

class NextJSRoutesPlugin implements WebpackPluginInstance {
  constructor(
    private readonly config: NextConfig,
    private readonly options: NextJSRoutesPluginOptions
  ) {}

  apply() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const cwd = this.options?.cwd ?? process.cwd();
    const watchDirs = [getPagesDirectory(cwd), getAppDirectory(cwd)]
      .filter((x) => x != undefined)
      .map((dir) => join(cwd, dir as string));

    if (watchDirs.length > 0) {
      const options = {
        ...this.config,
        ...this.options,
      };
      if (this.options.watch) {
        const watcher = watch(watchDirs, {
          persistent: true,
        });
        // batch changes
        const generate = debounce(() => writeNextjsRoutes(options), 50);
        watcher.on("add", generate).on("unlink", generate);
      } else {
        writeNextjsRoutes(options);
      }
    } else {
      logger.error(`Could not find a Next.js pages directory. Expected to find either 'pages' (1), 'src/pages' (2), or 'app' (3) in your project root.

  1. https://nextjs.org/docs/basic-features/pages
  2. https://nextjs.org/docs/advanced-features/src-directory
  3. https://nextjs.org/blog/next-13#app-directory-beta
  `);
    }
  }
}

interface WithRoutesOptions {
  /**
   * The file path indicating the output directory where the generated route types
   * should be written to (e.g.: "types").
   */
  outDir?: string;
}

export default function withRoutes(
  options?: WithRoutesOptions
): (nextConfig: NextConfig) => NextConfig {
  return function (nextConfig) {
    return {
      ...nextConfig,
      webpack: (config: Configuration, context) => {
        if (!config.plugins) {
          config.plugins = [];
        }

        config.plugins.push(
          new NextJSRoutesPlugin(nextConfig, {
            // only watch in development
            watch: context.dev && !context.isServer,
            ...options,
          })
        );

        // invoke any existing webpack extensions
        if (nextConfig.webpack) {
          return nextConfig.webpack(config, context);
        }
        return config;
      },
    };
  };
}
