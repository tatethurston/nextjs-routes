#!/usr/bin/env node

import { writeFileSync } from "fs";
import { join } from "path";
import { getPagesDirectory, findFiles, generate, nextRoutes } from "./utils.js";

const NEXTJS_PAGES_DIRECTORY = join(".", getPagesDirectory());

async function main(): Promise<void> {
  const files = findFiles(NEXTJS_PAGES_DIRECTORY);
  const routes = nextRoutes(files);
  let generated = generate(routes);

  try {
    const prettier = await import("prettier");
    generated = prettier.format(generated, { parser: "typescript" });
    // eslint-disable-next-line no-empty
  } catch (e) {
    console.warn(e);
  }

  writeFileSync("nextjs-routes.d.ts", generated);
}

void main();
