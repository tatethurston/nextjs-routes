#!/usr/bin/env node

import { writeFileSync } from "fs";
import { join } from "path";
import { getPagesDirectory, findFiles, generate, nextRoutes } from "./utils.js";

const pagesDirectory = getPagesDirectory() as string;
const files = findFiles(join(".", pagesDirectory));
const routes = nextRoutes(files, pagesDirectory);
const generated = generate(routes);

writeFileSync("nextjs-routes.d.ts", generated);
