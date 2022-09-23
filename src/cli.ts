#!/usr/bin/env node

import { cli } from "./core.js";

console.warn(
  `[nextjs-routes]: Direct invocation of nextjs-routes has been deprecated in favor of automatic regeneration via 'withRoutes': https://github.com/tatethurston/nextjs-routes#installation--usage-. See https://github.com/tatethurston/nextjs-routes/issues/63 for the motivation behind this change or to voice any concerns.`
);
cli();
