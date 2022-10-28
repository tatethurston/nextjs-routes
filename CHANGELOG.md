# Changelog

## 0.1.6

- `nextjs-routes` now accepts path strings for static routes:

  ```tsx
  <Link href="/foo">Foo</Link>
  ```

  Thanks [@MariaSolOs](https://github.com/MariaSolOs) for the contribution!

- `nextjs-routes` now uses function overloads for `Link` and `router.push` and `router.replace`. This yields better hints for typos in pathnames:

  ```tsx
  <Link href={{ pathname: "/foosy/[foo]" }}>Foo</Link>
  ```

  Previously:
  `[tsserver 2322] [E] Type '"/foos/[foo]"' is not assignable to type '"/"'.`

  Now:
  `Type '"/foosy/[foo]"' is not assignable to type '"/api/hello" | "/bars/[bar]" | "/foos/[foo]" | "/"'. Did you mean '"/foos/[foo]"'?` (+2 other overload errors).

## 0.1.5

- Export `Locale` from `nextjs-routes`.

  ```ts
  import { Locale } from "nextjs-routes";
  ```

  Thanks [@Asamsig](https://github.com/Asamsig) for the contribution!

## 0.1.4

- `nextjs-routes` now generates route types for [Nextjs i18n configuration](https://nextjs.org/docs/advanced-features/i18n-routing). Eg the following next config:

```js
module.exports = withRoutes({
  i18n: {
    defaultLocale: "de-DE",
    locales: ["de-DE", "en-FR", "en-US"],
  },
});
```

Will make `locale` typed as `'de-DE' | 'en-FR' | 'en-US'` for `Link` and `useRouter`.

## 0.1.3

- `nextjs-routes` [pageExtensions](https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions) has been updated to respect multiple extensions such as `.page.tsx`. In `0.1.2`, only single extensions `.tsx` were respected. This is now identical behavior to Next.js.

## 0.1.2

- `nextjs-routes` now respects [pageExtensions](https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions) from `next.config.js`.

## 0.1.1

[ skipped ]

## 0.1.0

This release contains a breaking change, indicated by the minor version bump to 0.1.0. `nextjs-routes` has not yet reached v1, but will follow semantic versioning once it does. Until then, minor version changes will be used to help flag breaking changes.

- Breaking change: the `withRoutes` import path and invocation has changed to better align with the general pattern in the Nextjs plugin ecosystem and to support configuration options, notably the new `outDir` option. It also now includes an ESM export to support usage in `next.config.mjs`.

```diff
- const { withRoutes } = require("nextjs-routes/next-config.cjs");
+ const withRoutes = require("nextjs-routes/config")();

/** @type {import('next').NextConfig} */
const nextConfig = {
 reactStrictMode: true,
};

module.exports = withRoutes(nextConfig);
```

Note the import path has changed and the import itself has changed to function that is invoked with any configuration options. This provides better ergonomics for configuration options:

```js
const withRoutes = require("nextjs-routes/config")({ outDir: "types" });
```

- The type `RoutedQuery` has been added to retrieve the `Query` for a given `Route`. This is useful as the context type parameter inside `getStaticProps` and `getServerSideProps`. Thanks [@MariaSolOs](https://github.com/MariaSolOs) for the contribution!

- `withRoutes` now accepts `outDir` as a configuration option to dictate where `nextjs-routes.d.ts` is generated. Thanks [@MariaSolOs](https://github.com/MariaSolOs) for the contribution!

## 0.0.22

- Deprecate direct invocation of nextjs-routes in favor of automatic regeneration via [withRoutes](https://github.com/tatethurston/nextjs-routes#installation--usage-). See [#63](https://github.com/tatethurston/nextjs-routes/issues/63) for the motivation behind this change or to voice any concerns.

## 0.0.21

- Add `route` runtime for generating type safe pathnames from a `Route` object

This can be used to fetch from API routes:

```ts
import { route } from "nextjs-routes";

fetch(route({ pathname: "/api/foos/[foo]", query: { foo: "foobar" } }));
```

Or for type safe redirects from `getServerSideProps`:

```ts
import { route } from "nextjs-routes";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: route({ pathname: "/foos/[foo]", query: { foo: "foobar" } }),
      permanent: false,
    },
  };
};
```

## 0.0.20

- Move `chokidar` from `devDependencies` to `dependencies` so it's installed automatically.

## 0.0.19

- Bug Fix: quote query segments in generated types. See [#49](https://github.com/tatethurston/nextjs-routes/issues/49) for more context.
- Bug Fix: don't generate routes for non navigable routes (`_error`, `_app`, `_document`).
- Bug Fix: don't generate routes for test files that are co-located in pages directory. See [#50](https://github.com/tatethurston/nextjs-routes/pull/50) for more context.

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
