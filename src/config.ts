/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextConfig } from "next";
import type { Configuration, WebpackPluginInstance } from "webpack";
import { getAppDirectory, getPagesDirectory } from "./utils.js";
import { watch } from "chokidar";
import { logger, NextJSRoutesOptions, writeNextjsRoutes } from "./core.js";

type WebpackConfigContext = Parameters<NonNullable<NextConfig["webpack"]>>[1];

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
  /**
   * If you are getting the `Could not find a Next.js pages directory` error,
   * try passing `cwd: __dirname` from your `next.config.js`.
   */
  cwd?: string;
}

class NextJSRoutesPlugin implements WebpackPluginInstance {
  name = "NextJSRoutesPlugin";
  constructor(
    private readonly config: NextConfig,
    private readonly context: WebpackConfigContext,
    private readonly options: NextJSRoutesPluginOptions = {}
  ) {}

  apply() {
    if (this.context.isServer) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const cwd = this.options?.cwd ?? process.cwd();
    const watchDirs = [getPagesDirectory(cwd), getAppDirectory(cwd)].filter(
      (x) => x != undefined
    ) as string[];

    if (watchDirs.length <= 0) {
      logger.error(`Could not find a Next.js pages directory. Expected to find either 'pages' (1), 'src/pages' (2), or 'app' (3) in your project root.

  1. https://nextjs.org/docs/basic-features/pages
  2. https://nextjs.org/docs/advanced-features/src-directory
  3. https://nextjs.org/blog/next-13#app-directory-beta
  `);
      return;
    }
    const options = {
      ...this.config,
      ...this.options,
    };
    if (this.context.dev) {
      const watcher = watch(watchDirs, {
        persistent: true,
      });
      // batch changes
      const generate = debounce(() => writeNextjsRoutes(options), 50);
      watcher.on("add", generate).on("unlink", generate);
    } else {
      writeNextjsRoutes(options);
    }
  }
}

type WithRoutesOptions = Pick<NextJSRoutesOptions, "outDir" | "dir">;

export default function withRoutes(
  options?: WithRoutesOptions
): (nextConfig: NextConfig) => NextConfig {
  return function (nextConfig) {
    return {
      ...nextConfig,
      webpack: (config: Configuration, context) => {
        config.plugins ??= [];
        config.plugins.push(
          new NextJSRoutesPlugin(nextConfig, context, options)
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
