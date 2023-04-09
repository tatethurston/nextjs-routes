#!/usr/bin/env node

import { getAppDirectory, getPagesDirectory } from "./utils.js";
import { writeNextjsRoutes } from "./core.js";

const logger: Pick<Console, "error" | "info"> = {
  error: (str: string) => console.error("[nextjs-routes] " + str),
  info: (str: string) => console.info("[nextjs-routes] " + str),
};

function cli(): void {
  const dirs = [
    getPagesDirectory(process.cwd()),
    getAppDirectory(process.cwd()),
  ].filter((x) => x != undefined);
  if (dirs.length === 0) {
    logger.error(`Could not find a Next.js pages directory. Expected to find either 'pages' (1), 'src/pages' (2), or 'app' (3) in your project root.

  1. https://nextjs.org/docs/basic-features/pages
  2. https://nextjs.org/docs/advanced-features/src-directory
  3. https://nextjs.org/blog/next-13#app-directory-beta
  `);
    process.exit(1);
  } else {
    writeNextjsRoutes({});
    logger.info("Generated route types.");
  }
}

cli();
