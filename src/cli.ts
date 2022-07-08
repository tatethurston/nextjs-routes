#!/usr/bin/env node

import { writeFileSync } from "fs";
import { join } from "path";
import { getPagesDirectory, findFiles, generate, nextRoutes } from "./utils.js";

const NEXTJS_PAGES_DIRECTORY = join(".", getPagesDirectory());

function main(): void {
  const files = findFiles(NEXTJS_PAGES_DIRECTORY);
  const routes = nextRoutes(files);
  const generated = generate(routes);

  writeFileSync("nextjs-routes.d.ts", generated);
}

main();
