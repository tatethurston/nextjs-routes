#!/usr/bin/env node

import { writeFileSync } from "fs";
import { join } from "path";
import {
  NEXTJS_PAGES_DIRECTORY_NAME,
  findFiles,
  generate,
  nextRoutes,
} from "./utils";

const NEXTJS_PAGES_DIRECTORY = join(".", NEXTJS_PAGES_DIRECTORY_NAME);

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
