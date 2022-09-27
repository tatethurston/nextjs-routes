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
import { writeNextjsRoutes } from "./core.js";
import { existsSync, mkdirSync } from "fs";

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

export interface NextJSRoutesOptions {
  /**
   * The file path indicating the output directory where the generated route types
   * should be written to (e.g.: "types").
   */
  outDir?: string;
}

class NextJSRoutesPlugin implements WebpackPluginInstance {
  constructor(
    private readonly config: NextJSRoutesPluginConfig,
    private readonly options?: NextJSRoutesOptions
  ) {}

  apply() {
    const pagesDirectory = getPagesDirectory();
    const outDir = this.options?.outDir ?? "";
    if (outDir && !existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    const outputFilepath = join(outDir, "nextjs-routes.d.ts");
    if (pagesDirectory) {
      if (this.config.watch) {
        const dir = join(process.cwd(), pagesDirectory);
        const watcher = watch(dir, {
          persistent: true,
        });
        // batch changes
        const generate = debounce(
          () => writeNextjsRoutes(pagesDirectory, outputFilepath),
          50
        );
        watcher.on("add", generate).on("unlink", generate);
      } else {
        writeNextjsRoutes(pagesDirectory, outputFilepath);
      }
    }
  }
}

export default function withRoutes(
  options?: NextJSRoutesOptions
): (nextConfig: NextConfig) => NextConfig {
  return function (nextConfig) {
    return {
      ...nextConfig,
      webpack: (config: Configuration, context) => {
        if (!config.plugins) {
          config.plugins = [];
        }

        // only watch in development
        config.plugins.push(
          new NextJSRoutesPlugin(
            {
              watch: context.dev && !context.isServer,
            },
            options
          )
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
