import { writeFileSync } from "fs";
import { join } from "path";
import { findFiles, getPagesDirectory } from "./utils.js";

const NEXTJS_NON_ROUTABLE = ["/_app", "/_document", "/_error", "/middleware"];
const DYNAMIC_SEGMENT_RE = /\[(.*?)\]/g;

type QueryType = "dynamic" | "catch-all" | "optional-catch-all";

interface Route {
  pathname: string;
  query: Record<string, QueryType>;
}

function convertWindowsPathToUnix(file: string): string {
  return file.replace(/\\/g, "/");
}

export function nextRoutes(files: string[], pagesDirectory: string): Route[] {
  const pathnames = files
    // remove page directory path
    .map((file) => file.replace(pagesDirectory, ""))
    // remove file extensions (.tsx, .test.tsx)
    .map((file) => file.replace(/(\.\w+)+$/, ""))
    // remove duplicates from file extension removal (eg foo.ts and foo.test.ts)
    .filter((file, idx, array) => array.indexOf(file) === idx)
    // normalize paths from windows users
    .map(convertWindowsPathToUnix)
    // remove index if present (/foos/index.ts is the same as /foos.ts)
    .map((file) => file.replace(/index$/, ""))
    // remove trailing slash if present
    .map((file) =>
      file.endsWith("/") && file.length > 2 ? file.slice(0, -1) : file
    )
    // exclude nextjs special routes
    .filter((file) => !NEXTJS_NON_ROUTABLE.includes(file));

  return pathnames.map((pathname) => {
    const segments = pathname.match(DYNAMIC_SEGMENT_RE) ?? [];
    const query = segments.reduce<Route["query"]>((acc, cur) => {
      const param = cur
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        .replace("...", "");
      let queryType: QueryType = "dynamic";
      if (cur.startsWith("[[")) {
        queryType = "optional-catch-all";
      } else if (cur.startsWith("[...")) {
        queryType = "catch-all";
      }
      acc[param] = queryType;
      return acc;
    }, {});

    return {
      pathname,
      query,
    };
  });
}

function getQueryInterface(
  query: Route["query"]
): [query: string, requiredKeys: number] {
  let requiredKeys = 0;
  const keys = Object.entries(query)
    .map(([key, value]) => {
      switch (value) {
        case "dynamic": {
          requiredKeys += 1;
          return `"${key}": string`;
        }
        case "catch-all": {
          requiredKeys += 1;
          return `"${key}": string[]`;
        }
        case "optional-catch-all": {
          return `"${key}"?: string[] | undefined`;
        }
        // istanbul ignore next
        default: {
          const _exhaust: never = value;
          return _exhaust;
        }
      }
    })
    .join("; ");

  return [`{ ${keys} }`, requiredKeys];
}

function generate(routes: Route[]): string {
  const unknownQueryParamsType =
    "{ [key: string]: string | string[] | undefined }";
  return `\
// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
// This file will be automatically regenerated when your Next.js server is running.
/* eslint-disable */

// prettier-ignore
declare module "nextjs-routes" {
  export type Route =
    ${
      !routes.length
        ? "never"
        : `| ${routes
            .map((route) => {
              const [query, requiredKeys] = getQueryInterface(route.query);
              if (requiredKeys > 0) {
                return `{ pathname: "${route.pathname}"; query: Query<${query}> }`;
              } else {
                return `{ pathname: "${route.pathname}"; query?: Query | undefined }`;
              }
            })
            .join("\n    | ")}`
    };

  type Query<Params = {}> = Params & ${unknownQueryParamsType};

  /**
   * A typesafe utility function for generating paths in your application.
   *
   * route({ pathname: '/foos/[foo]', query: { foo: 'bar' }}) will produce '/foos/bar'.
   */
  export declare function route(r: Route): string;
}

// prettier-ignore
declare module "next/link" {
  import type { Route } from "nextjs-routes";
  import type { LinkProps as NextLinkProps } from "next/dist/client/link";
  import type { PropsWithChildren, MouseEventHandler } from "react";
  export * from "next/dist/client/link";

  type RouteOrQuery = Route | { query?: ${unknownQueryParamsType} };

  export interface LinkProps extends Omit<NextLinkProps, "href"> {
    href: RouteOrQuery;
  }

  declare function Link(
    props: PropsWithChildren<LinkProps>
  ): DetailedReactHTMLElement<
    {
      onMouseEnter?: MouseEventHandler<Element> | undefined;
      onClick: MouseEventHandler;
      href?: string | undefined;
      ref?: any;
    },
    HTMLElement
  >;

  export default Link;
}

// prettier-ignore
declare module "next/router" {
  import type { Route } from "nextjs-routes";
  import type { NextRouter as Router } from "next/dist/client/router";
  export * from "next/dist/client/router";
  export { default } from "next/dist/client/router";

  type TransitionOptions = Parameters<Router["push"]>[2];

  type Pathname = Route["pathname"];

  export type QueryForPathname = {
    [K in Route as K["pathname"]]: Exclude<K["query"], undefined>;
  };

  type RouteOrQuery = Route | { query: ${unknownQueryParamsType} };

  export interface NextRouter<P extends Pathname = Pathname>
    extends Omit<Router, "push" | "replace"> {
    pathname: P;
    route: P;
    query: QueryForPathname[P];
    push(
      url: RouteOrQuery,
      as?: string,
      options?: TransitionOptions
    ): Promise<boolean>;
    replace(
      url: RouteOrQuery,
      as?: string,
      options?: TransitionOptions
    ): Promise<boolean>;
  }

  export function useRouter<P extends Pathname>(): NextRouter<P>;
}
`;
}

const logger: Pick<Console, "error"> = {
  error: (str: string) => console.error("[nextjs-routes] " + str),
};

export function writeNextjsRoutes(
  pagesDirectory: string,
  outputFilepath: string
): void {
  const files = findFiles(join(".", pagesDirectory));
  const routes = nextRoutes(files, pagesDirectory);
  const generated = generate(routes);

  writeFileSync(outputFilepath, generated);
}

export function cli(): void {
  const pagesDirectory = getPagesDirectory();
  if (!pagesDirectory) {
    logger.error(`Could not find a Next.js pages directory. Expected to find either pages(1) or src/pages(2).

  1. https://nextjs.org/docs/basic-features/pages
  2. https://nextjs.org/docs/advanced-features/src-directory
  `);
    process.exit(1);
  } else {
    writeNextjsRoutes(pagesDirectory, "nextjs-routes.d.ts");
  }
}
