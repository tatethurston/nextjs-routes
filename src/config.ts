/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextConfig } from "next";
import { join } from "path";
import type { Configuration, WebpackPluginInstance } from "webpack";
import { getPagesDirectory } from "./utils.js";
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
}

class NextJSRoutesPlugin implements WebpackPluginInstance {
  constructor(
    private readonly config: NextConfig,
    private readonly options: NextJSRoutesPluginOptions
  ) {}

  apply() {
    const pagesDirectory = getPagesDirectory();
    if (pagesDirectory) {
      const options = {
        ...this.config,
        ...this.options,
        pagesDirectory,
      };
      if (this.options.watch) {
        const dir = join(process.cwd(), pagesDirectory);
        const watcher = watch(dir, {
          persistent: true,
        });
        // batch changes
        const generate = debounce(() => writeNextjsRoutes(options), 50);
        watcher.on("add", generate).on("unlink", generate);
      } else {
        writeNextjsRoutes(options);
      }
    } else {
      logger.error(`Could not find a Next.js pages directory. Expected to find either pages(1) or src/pages(2).

  1. https://nextjs.org/docs/basic-features/pages
  2. https://nextjs.org/docs/advanced-features/src-directory
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
