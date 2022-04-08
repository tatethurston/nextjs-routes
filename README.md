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

## Installation & Usage 📦

1. Add this package to your project:
   - `yarn add nextjs-routes`
2. Run `yarn nextjs-routes`
  - This will generate `nextjs-routes.d.ts`
  - Whenever you change your routes, run this command again
4. Replace imports of `next/link` with `nextjs-routes/link` and `next/router` with `nextjs-routes/router`.

```diff
-import Link from "next/link";
+import Link from "nextjs-routes/link";
```

```diff
-import Link from "next/router";
+import Link from "nextjs-routes/router";
```

4. That's it! `nextjs-routes` reexports `next/link` and `next/router` from Next.js with type defintions that have been augmented to verify you application's routes. No more broken links, and you get route autocompletion 🙌.

## Examples 🛠

Check out the [example](https://github.com/tatethurston/nextjs-routes/tree/main/examples/typescript-example) for a full Next.js project!

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
