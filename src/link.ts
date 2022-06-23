// istanbul ignore next: trivial
import Link from "next/link";
export * from "next/link";
// NextJS exports CJS as exports.default, which does not interop correctly with ESM
// See node_modules/next/dist/client/link.js
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
export default (Link as any).default as typeof import("next/link");
