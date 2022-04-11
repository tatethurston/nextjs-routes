# Next.js Routes

<blockquote>Type safe routing for Next.js</blockquote>

<br />

<a href="https://www.npmjs.com/package/nextjs-routes">
  <img src="https://img.shields.io/npm/v/nextjs-routes.svg">
</a>
<a href="https://github.com/tatethurston/nextjs-routes/blob/master/LICENSE">
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

   - `yarn add nextjs-routes`

2. Run `yarn nextjs-routes`

   - This will generate `nextjs-routes.d.ts`
   - Whenever you change your routes, run this command again

3. Replace imports of `next/link` with `nextjs-routes/link` and `next/router` with `nextjs-routes/router`.

   ```diff
   -import Link from "next/link";
   +import Link from "nextjs-routes/link";
   ```

   ```diff
   -import { useRouter } from 'next/router'
   +import { useRouter } from 'nextjs-routes/router'
   ```

4. That's it! `nextjs-routes` reexports `next/link` and `next/router` from Next.js with type defintions that have been augmented to verify your application's routes. No more broken links, and you get route autocompletion 🙌.

## Examples 🛠

### Link

`Link`'s `href` prop is now typed based on your application routes and expects a URL object:

```tsx
import Link from "nextjs-routes/link";

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
import { useRouter } from "nextjs-routes/link";

router.push({ pathname: "/foos/[foo]", query: { foo: "test" } });
```

#### replace

```tsx
import { useRouter } from "nextjs-routes/link";

router.replace({ pathname: "/" });
```

#### query

```tsx
import { useRouter } from "nextjs-routes/link";

// query is typed as a union of all query parameters defined by your application's routes
const { query } = useRouter();
```

By default, `query` will be typed as the union of all possible query parameters defined by your application routes. If you'd like to narrow the type to fewer routes or a single page, you can supply a type argument:

```tsx
import { useRouter } from "nextjs-routes/link";

// query is now typed as `{ foo: string }`
const { query } = useRouter<"/foos/[foo]">();
```

## Highlights

🦄 Zero config

💨 Types only -- no additional runtime overhead

🛠 No more broken links

🪄 Route autocompletion

🔗 Supports all Next.js route types: static, dynamic, catch all and optional catch all

## How does this work? 🤔

`nextjs-routes` generates types for the `pathname` and `query` for every page in your `pages` directory. The generated types are written to `nextjs-routes.d.ts` which is automatically referenced by your Next project's `tsconfig.json`. `nextjs-routes` reexports from `next/link` and `next/router` and `nextjs-routes.d.ts` applies the generated types to imports from `nextjs-routes`.

## Contributing 👫

PR's and issues welcomed! For more guidance check out [CONTRIBUTING.md](https://github.com/tatethurston/nextjs-routes/blob/master/CONTRIBUTING.md)

## Licensing 📃

See the project's [MIT License](https://github.com/tatethurston/nextjs-routes/blob/master/LICENSE).
