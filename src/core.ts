import { existsSync, mkdirSync, writeFileSync } from "fs";
import { I18NConfig } from "next/dist/server/config-shared.js";
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

function generate(routes: Route[], config: NextJSRoutesOptions): string {
  const i18n = config.i18n ?? {
    defaultLocale: "",
    domains: [],
    localeDetection: false,
    locales: [],
  };
  const unknownQueryParamsType =
    "{ [key: string]: string | string[] | undefined }";
  const locales = `\n      | ${i18n.locales
    .map((x) => `"${x}"`)
    .join("\n      | ")}`;
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

  type QueryForPathname = {
    [K in Route as K["pathname"]]: Exclude<K["query"], undefined>;
  };

  export type RoutedQuery<P extends Route["pathname"]> = QueryForPathname[P];

  export type Locale = ${!i18n.locales.length ? "undefined" : locales};
  
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

  export interface LinkProps extends Omit<NextLinkProps, "href" | "locale"> {
    href: RouteOrQuery;
    locale?: ${
      !i18n.locales.length ? "false" : `\n      | Locale\n      | false`
    };
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
  import type { Locale, Route, RoutedQuery } from "nextjs-routes";
  import type { NextRouter as Router } from "next/dist/client/router";
  export * from "next/dist/client/router";
  export { default } from "next/dist/client/router";

  type NextTransitionOptions = NonNullable<Parameters<Router["push"]>[2]>;

  interface TransitionOptions extends Omit<NextTransitionOptions, 'locale'> {
    locale?: ${
      !i18n.locales.length ? "false" : `\n      | Locale\n      | false`
    };
  };

  type RouteOrQuery = 
    | Route
    | { query: ${unknownQueryParamsType} };

  export interface NextRouter<P extends Route["pathname"] = Route["pathname"]>
    extends Omit<
      Router,
      "push" | "replace" | "locale" | "locales" | "defaultLocale" | "domainLocales"
    > {
    defaultLocale${
      i18n.defaultLocale ? `: "${i18n.defaultLocale}"` : "?: undefined"
    };
    domainLocales${
      i18n.domains?.length ? `: ${print(i18n.domains, 4)}` : "?: undefined"
    };
    locale${(!i18n.locales.length ? "?: " : ": ") + "Locale"};
    locales${
      i18n.locales.length ? `: ${print(i18n.locales, 4)}` : "?: undefined"
    };
    pathname: P;
    push(
      url: RouteOrQuery,
      as?: string,
      options?: TransitionOptions
    ): Promise<boolean>;
    query: RoutedQuery<P>;
    replace(
      url: RouteOrQuery,
      as?: string,
      options?: TransitionOptions
    ): Promise<boolean>;
    route: P;
  }

  export function useRouter<P extends Route["pathname"]>(): NextRouter<P>;
}
`;
}

function print(x: unknown, indent: number): string {
  return JSON.stringify(x, undefined, 2)
    .split("\n")
    .join("\n" + " ".repeat(indent));
}

export const logger: Pick<Console, "error"> = {
  error: (str: string) => console.error("[nextjs-routes] " + str),
};

interface NextJSRoutesOptions {
  /**
   * The directory where pages are located;
   */
  pagesDirectory: string;
  /**
   * The file path indicating the output directory where the generated route types
   * should be written to (e.g.: "types").
   */
  outDir?: string;
  /**
   * NextJS pageExtensions.
   * https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions
   */
  pageExtensions?: string[];
  /**
   * Internationalization configuration
   *
   * @see [Internationalization docs](https://nextjs.org/docs/advanced-features/i18n-routing)
   */
  i18n?: I18NConfig | null;
}

export function writeNextjsRoutes(options: NextJSRoutesOptions): void {
  const defaultOptions = {
    outDir: "",
    pageExtensions: ["tsx", "ts", "jsx", "js"],
  };
  const opts = {
    ...defaultOptions,
    ...options,
  };
  if (opts.outDir && !existsSync(opts.outDir)) {
    mkdirSync(opts.outDir, { recursive: true });
  }
  const outputFilepath = join(opts.outDir, "nextjs-routes.d.ts");
  const files = findFiles(join(".", opts.pagesDirectory)).filter((file) => {
    return opts.pageExtensions.some((ext) => file.endsWith(ext));
  });
  const routes = nextRoutes(files, opts.pagesDirectory);
  const generated = generate(routes, opts);
  writeFileSync(outputFilepath, generated);
}

export function cli(): void {
  console.warn(
    `[nextjs-routes]: Direct invocation of nextjs-routes has been deprecated in favor of automatic regeneration via 'withRoutes': https://github.com/tatethurston/nextjs-routes#installation--usage-. See https://github.com/tatethurston/nextjs-routes/issues/63 for the motivation behind this change or to voice any concerns.`
  );
  const pagesDirectory = getPagesDirectory();
  if (!pagesDirectory) {
    logger.error(`Could not find a Next.js pages directory. Expected to find either pages(1) or src/pages(2).

  1. https://nextjs.org/docs/basic-features/pages
  2. https://nextjs.org/docs/advanced-features/src-directory
  `);
    process.exit(1);
  } else {
    writeNextjsRoutes({
      pagesDirectory,
    });
  }
}
