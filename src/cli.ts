#!/usr/bin/env node

import { writeFileSync } from "fs";
import { join } from "path";
import { getPagesDirectory, findFiles, generate, nextRoutes } from "./utils.js";

const logger: Pick<Console, "error"> = {
  error: (str: string) => console.error("[nextjs-routes] " + str),
};

const pagesDirectory = getPagesDirectory();
// istanbul ignore else: covered by e2e.test
if (!pagesDirectory) {
  logger.error(`Could not find a Next.js pages directory. Expected to find either pages(1) or src/pages(2).

1. https://nextjs.org/docs/basic-features/pages
2. https://nextjs.org/docs/advanced-features/src-directory
`);
  process.exit(1);
} else {
  const files = findFiles(join(".", pagesDirectory));
  const routes = nextRoutes(files, pagesDirectory);
  const generated = generate(routes);

  writeFileSync("nextjs-routes.d.ts", generated);
}
