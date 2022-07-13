# Changelog

## 0.0.18

- `query` is now typed as `string | string[] | undefined` instead of `string | undefined`.
- `nextjs-routes` can now be configured via your `next.config.js` to automatically regenerate types whenever your routes change:

  ```js
  // next.config.js

  /** @type {import('next').NextConfig} */
  const { withRoutes } = require("nextjs-routes/next-config.cjs");

  const nextConfig = {
    reactStrictMode: true,
  };

  module.exports = withRoutes(nextConfig);
  ```

  This wiring will only run in Next.js' development server (eg `npx next dev`) and `withRoutes` will no-op in production.

## 0.0.17

- re-export types from `next/link` and `next/router`.
- remove prettier as a peer dependency.
- enable src/pages for windows users.
- routes are now generated for routes that start with `_`. `_app`, `_document`, `_error` and `middleware` are excluded.
- gracefully handles missing pages directory and no pages.

## 0.0.16

- fixed prettier as an optional peer dependency

## 0.0.15

- nextjs-routes no longer adds types to the global type namespace. Previously,
  `Route` was available globally. Now, it must be imported:

```ts
import type { Route } from "nextjs-routes";
```

- query from `useRouter` is now correctly typed as `string | undefined` instead of `string`. If you know the current route, you can supply a type argument to narrow required parameters to `string`, eg:

```
  // if you have a page /foos/[foo].ts

  const router = useRouter<"/foos/[foo]">();
  // foo will be typed as a string, because the foo query parameter is required and thus will always be present.
  const { foo } = router.query;
```

## 0.0.14

- Allow passing in `query` without `pathname` to change current url parameters.
- `router.query` can no longer be `undefined`.

## 0.0.13

- Support search parameters. See [#17](https://github.com/tatethurston/nextjs-routes/issues/17) for more context.

## 0.0.12

- Removed reexports of `next/link` and `next/router`.

This means replacing imports of `next/link` with `nextjs-routes/link` and `next/router` with `nextjs-routes/router` is no longer necessary:

```diff
-import Link from "nextjs-routes/link";
+import Link from "next/link";
```

```diff
-import { useRouter } from 'nextjs-routes/router'
+import { useRouter } from 'next/router'
```

- Added windows support.
