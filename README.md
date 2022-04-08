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

## What is this? 🧐

A code generation tool to make `next/link` and `next/router` routes type safe. `nextjs-routes` scans your `pages` directory and generates a `nextjs-routes.d.ts` file with type definitions for all your routes.

## Getting Started 🚀

1. Run `yarn nextjs-routes`. This will generate `nextjs-routes.d.ts`. Whenever you change your routes, run this command again.
2. Replace imports of `next/link` with `nextjs-routes/link` and `next/router` with `nextjs-routes/router`.
3. That's it! `nextjs-routes` reexports from next with types for `next/link` and `next/router` that have been augmented to verify valid route arguments. No more broken links, and you get route autocompletion 🙌.

## Examples 🛠

Check out the [example](https://github.com/tatethurston/nextjs-routes/tree/main/examples/typescript-example) for a full Next.js project!

## Installation & Usage 📦

1. Add this package to your project:
   - `yarn add nextjs-routes`

```diff
diff --git a/examples/typescript-example/pages/index.tsx b/examples/typescript-example/pages/index.tsx
index 060fb62..7e6f350 100644
--- a/examples/typescript-example/pages/index.tsx
+++ b/examples/typescript-example/pages/index.tsx
@@ -2,7 +2,7 @@ import type { NextPage } from "next";
 import Head from "next/head";
 import { useEffect } from "react";
 import { useRouter } from "nextjs-routes/router";
-import Link from "nextjs-routes/link";
+import Link from "next/link";

 const Home: NextPage = () => {
   const router = useRouter();
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
