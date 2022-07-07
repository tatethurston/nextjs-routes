# Changelog

## 0.0.15

- nextjs-routes no longer adds types to the global type namespace. Previously,
  `Route` was available globally. Now, it must be imported:

```ts
import type { Route } from "nextjs-routes";
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
