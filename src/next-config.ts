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

const nextRoutesPlugin: WebpackPluginInstance = {
  apply() {
    const pagesDirectory = getPagesDirectory();
    if (pagesDirectory) {
      const dir = join(process.cwd(), pagesDirectory);
      const watcher = watch(dir, {
        persistent: true,
      });
      // batch changes
      const generate = debounce(() => writeNextjsRoutes(pagesDirectory), 50);
      watcher.on("add", generate).on("unlink", generate);
    }
  },
};

export function withRoutes(nextConfig: NextConfig): NextConfig {
  return {
    ...nextConfig,
    webpack: (config: Configuration, context) => {
      // only generate in development
      if (context.dev && !context.isServer) {
        if (!config.plugins) {
          config.plugins = [];
        }
        config.plugins.push(nextRoutesPlugin);
      }
      // invoke any existing webpack extensions
      if (nextConfig.webpack) {
        return nextConfig.webpack(config, context);
      }
      return config;
    },
  };
}
