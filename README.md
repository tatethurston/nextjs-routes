# Next.js Routes

<blockquote>Type safe routing for Next.js</blockquote>

<br />

<a href="https://www.npmjs.com/package/nextjs-routes">
  <img src="https://img.shields.io/npm/v/nextjs-routes.svg">
</a>
<a href="https://github.com/tatethurston/nextjs-routes/blob/master/LICENSE">
  <img src="https://img.shields.io/npm/l/nextjs-routes.svg">
</a>
<a href="https://bundlephobia.com/result?p=nextjs-routes">
  <img src="https://img.shields.io/bundlephobia/minzip/nextjs-routes">
</a>
<a href="https://www.npmjs.com/package/nextjs-routes">
  <img src="https://img.shields.io/npm/dy/nextjs-routes.svg">
</a>
<a href="https://github.com/tatethurston/nextjs-routes/actions/workflows/ci.yml">
  <img src="https://github.com/tatethurston/nextjs-routes/actions/workflows/ci.yml/badge.svg">
</a>

## What is this? 🧐

A code generation tool to make `next/link` and `next/router` routes type safe. `nextjs-routes` scans your `pages` directory and generates a `nextjs-routes.d.ts` file with type definitions for all your routes.

## Getting Started 🚀

1. `yarn nextjs-routes`. This will generate `nextjs-routes.d.ts`. Whenever you change your routes, run this command again.
2. That's it! The types for `next/link` and `next/router` have been augmented to verify valid routes are passed. No more broken links, and you get route autocompletion 🙌.

## Examples 🛠

Check out the [example](https://github.com/tatethurston/nextjs-routes/tree/main/examples/typescript-example) for a full Next.js project!

## Installation & Usage 📦

1. Add this package to your project:
   - `yarn add --dev nextjs-routes`

## Highlights

0️⃣ Zero config
💨 Types only -- no runtime dependencies
🛠 No more broken links
🪄 Route autocompletion
🔗 Supports all Next.js route types: static, dynamic, catch all and optional catch all

## How does this work? 🤔

`nextjs-routes` generates types for the `pathname` and `query` for every page in your `pages` directory. The generated types are written to `nextjs-routes.d.ts` which is automatically referenced by your Next project's `tsconfig.json`.

## Contributing 👫

PR's and issues welcomed! For more guidance check out [CONTRIBUTING.md](https://github.com/tatethurston/nextjs-routes/blob/master/CONTRIBUTING.md)

## Licensing 📃

See the project's [MIT License](https://github.com/tatethurston/nextjs-routes/blob/master/LICENSE).
