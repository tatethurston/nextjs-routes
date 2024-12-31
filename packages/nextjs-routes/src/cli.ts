#!/usr/bin/env node

import type { NextConfig } from "next";
import { writeNextJSRoutes } from "./core.js";
import { getAppDirectory, getPagesDirectory, isNotUndefined } from "./utils.js";
import { cwd } from "node:process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "url";

const logger: Pick<Console, "error" | "info"> = {
  error: (str: string) => console.error("[nextjs-routes] " + str),
  info: (str: string) => console.info("[nextjs-routes] " + str),
};

async function loadNextConfig(dir: string): Promise<NextConfig | undefined> {
  const jsPath = join(dir, "next.config.js");
  const mjsPath = join(dir, "next.config.mjs");

  let path = "";
  if (existsSync(jsPath)) {
    path = jsPath;
  } else if (existsSync(mjsPath)) {
    path = mjsPath;
  }

  if (!path) {
    return;
  }

  logger.info(`Found ${jsPath}`);
  const mod = (await import(pathToFileURL(path).href)).default;
  if (typeof mod == "function") {
    return await mod("phase-production-server", {});
  }
  return mod;
}

async function cli(): Promise<void> {
  const dir = cwd();
  const config = await loadNextConfig(dir);
  if (!config) {
    logger.error(
      `Could not find a next.config.js or next.config.mjs. Expected to find either in ${dir}.`,
    );
    process.exit(1);
  }

  const dirs = [
    getPagesDirectory(process.cwd()),
    getAppDirectory(process.cwd()),
  ].filter(isNotUndefined);
  if (dirs.length === 0) {
    logger.error(
      `Could not find a pages or app directory. Expected to find eitherin ${dir}.`,
    );

    process.exit(1);
  }

  writeNextJSRoutes(config);
  logger.info("Generated route types.");
}

await cli();
