/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextConfig } from "next";
import { join } from "path";
import type { Configuration, WebpackPluginInstance } from "webpack";
import { getPagesDirectory } from "./utils";
import { watch } from "chokidar";
import { writeNextjsRoutes } from "./core";

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

interface NextJSRoutesPluginConfig {
  watch?: boolean;
}

class NextJSRoutesPlugin implements WebpackPluginInstance {
  constructor(
    private readonly config: NextJSRoutesPluginConfig,
    private readonly generatedFileLocation: string
  ) {}

  apply() {
    const pagesDirectory = getPagesDirectory();
    if (pagesDirectory) {
      if (this.config.watch) {
        const dir = join(process.cwd(), pagesDirectory);
        const watcher = watch(dir, {
          persistent: true,
        });
        // batch changes
        const generate = debounce(() => writeNextjsRoutes(pagesDirectory, this.generatedFileLocation), 50);
        watcher.on("add", generate).on("unlink", generate);
      } else {
        writeNextjsRoutes(pagesDirectory, this.generatedFileLocation);
      }
    }
  }
}

export function withRoutes(nextConfig: NextConfig, generatedFileLocation = "nextjs-routes.d.ts"): NextConfig {
  return {
    ...nextConfig,
    webpack: (config: Configuration, context) => {
      if (!config.plugins) {
        config.plugins = [];
      }

      // only watch in development
      config.plugins.push(
        new NextJSRoutesPlugin({
          watch: context.dev && !context.isServer,
        }, generatedFileLocation)
      );

      // invoke any existing webpack extensions
      if (nextConfig.webpack) {
        return nextConfig.webpack(config, context);
      }
      return config;
    },
  };
}
