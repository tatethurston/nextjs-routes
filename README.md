# Next.js Routes

<blockquote>Type safe routing for Next.js</blockquote>

<br />

<a href="https://www.npmjs.com/package/nextjs-routes">
  <img src="https://img.shields.io/npm/v/nextjs-routes.svg">
</a>
<a href="https://github.com/tatethurston/nextjs-routes/blob/main/LICENSE">
  <img src="https://img.shields.io/npm/l/nextjs-routes.svg">
</a>
<a href="https://www.npmjs.com/package/nextjs-routes">
  <img src="https://img.shields.io/npm/dy/nextjs-routes.svg">
</a>
<a href="https://github.com/tatethurston/nextjs-routes/actions/workflows/ci.yml">
  <img src="https://github.com/tatethurston/nextjs-routes/actions/workflows/ci.yml/badge.svg">
</a>
<a href="https://codecov.io/gh/tatethurston/nextjs-routes">
  <img src="https://img.shields.io/codecov/c/github/tatethurston/nextjs-routes/main.svg?style=flat-square">
</a>

<br />

![nextjs-routes preview gif](./images/nextjs-routes.gif)

## What is this? 🧐

A code generation tool to make `next/link` and `next/router` routes type safe. `nextjs-routes` scans your `pages` directory and generates a `nextjs-routes.d.ts` file with type definitions for all your routes.

## Installation & Usage 📦

1. Add this package to your project:

   - `npm install nextjs-routes` or `yarn add nextjs-routes`

2. Run `npx nextjs-routes`

   - This will generate `nextjs-routes.d.ts`
   - Whenever you change your routes, run this command again. Or, [automatically regenerate](#automatic-regeneration) whenever your routes change.

3. That's it! `next/link` and `next/router` type definitions have been augmented to verify your application's routes. No more broken links, and you get route autocompletion 🙌.

## Examples 🛠

### Link

`Link`'s `href` prop is now typed based on your application routes and expects a URL object:

```tsx
import Link from "next/link";

function Home() {
  return (
    <Link
      href={{
        pathname: "/foos/[foo]",
        query: { foo: "test" },
      }}
    >
      <a>About us</a>
    </Link>
  );
}

export default Home;
```

### useRouter

`useRouter`'s returned router instance types for `push`, `replace` and `query` are now typed based on your application routes.

Identical to `Link`, `push` and `replace` now expect a URL object:

#### push

```tsx
import { useRouter } from "next/link";

const router = useRouter();
router.push({ pathname: "/foos/[foo]", query: { foo: "test" } });
```

#### replace

```tsx
import { useRouter } from "next/link";

const router = useRouter();
router.replace({ pathname: "/" });
```

#### query

```tsx
import { useRouter } from "next/link";

// query is typed as a union of all query parameters defined by your application's routes
const { query } = useRouter();
```

By default, `query` will be typed as the union of all possible query parameters defined by your application routes. If you'd like to narrow the type to fewer routes or a single page, you can supply a type argument:

```tsx
import { useRouter } from "next/link";

// query is now typed as `{ foo: string }`
const { query } = useRouter<"/foos/[foo]">();
```

### Route

If you want to use the generated `Route` type in your code, you can import it from `nextjs-routes`:

```ts
import type { Route } from "nextjs-routes";
```

## Automatic regeneration

`nextjs-routes` can be configured via your `next.config.js` to automatically regenerate types whenever your routes change:

```diff
+ const { withRoutes } = require("nextjs-routes/next-config.cjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

- module.exports = nextConfig;
+ module.exports = withRoutes(nextConfig);
```

This wiring will only run in Next.js' development server (eg `npx next dev`) and `withRoutes` will no-op in production.

## Highlights

🦄 Zero config

💨 Types only -- zero runtime

🛠 No more broken links

🪄 Route autocompletion

🔗 Supports all Next.js route types: static, dynamic, catch all and optional catch all

## How does this work? 🤔

`nextjs-routes` generates types for the `pathname` and `query` for every page in your `pages` directory. The generated types are written to `nextjs-routes.d.ts` which is automatically referenced by your Next project's `tsconfig.json`. `nextjs-routes.d.ts` redefines the types for `next/link` and `next/router` and applies the generated route types.

## What if I need a runtime?

There are some cases where you may want to generate a type safe path from a `Route` object, such as when `fetch`ing from an API route or serving redirects from `getServerSideProps`. These accept `strings` instead of the `Route` object that `Link` and `useRouter` accept. Because these do not perform the same string interpolation for dynamic routes, runtime code is required instead of a type only solution.

For these cases, you can use `route` from `nextjs-routes`:

### fetch

```ts
import { route } from "nextjs-routes";

fetch(route({ pathname: "/api/foos/[foo]", query: { foo: "foobar" } }));
```

### getServerSideProps

```ts
import { route } from "nextjs-routes";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: route({ pathname: "/foos/[foo]", query: { foo: "foobar" } }),
      permanent: false
    }
  };
};
```

## Contributing 👫

PR's and issues welcomed! For more guidance check out [CONTRIBUTING.md](https://github.com/tatethurston/nextjs-routes/blob/main/CONTRIBUTING.md)

## Licensing 📃

See the project's [MIT License](https://github.com/tatethurston/nextjs-routes/blob/main/LICENSE).
