import { existsSync, readdirSync, statSync } from "fs";
import { join, parse } from "path";

const NEXTJS_NON_ROUTABLE_PREFIX = "_";
const DYNAMIC_SEGMENT_RE = /\[(.*?)\]/g;

export function getPagesDirectory(): string {
  if (existsSync("pages")) {
    return "pages";
  }
  return "src/pages";
}

// istanbul ignore next
export function findFiles(entry: string): string[] {
  return readdirSync(entry).flatMap((file) => {
    const filepath = join(entry, file);
    if (
      statSync(filepath).isDirectory() &&
      !filepath.includes("node_modules")
    ) {
      return findFiles(filepath);
    }
    return filepath;
  });
}

type QueryType = "dynamic" | "catch-all" | "optional-catch-all";

interface Route {
  pathname: string;
  query: Record<string, QueryType>;
}

function convertWindowsPathToUnix(file: string): string {
  return file.replace(/\\/g, "/");
}

export function nextRoutes(files: string[]): Route[] {
  const pagesDirectory = getPagesDirectory();
  const filenames = files
    .map(convertWindowsPathToUnix)
    .map((file) =>
      file.replace(pagesDirectory, "").replace(parse(file).ext, "")
    )
    .filter((file) => !parse(file).name.startsWith(NEXTJS_NON_ROUTABLE_PREFIX));

  return filenames.map((filename) => {
    const segments = filename.match(DYNAMIC_SEGMENT_RE) ?? [];
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

    const pathWithoutIndexSuffix = filename.replace(/index$/, "");
    const pathWithoutTrailingSlash =
      pathWithoutIndexSuffix.endsWith("/") && pathWithoutIndexSuffix.length > 2
        ? pathWithoutIndexSuffix.slice(0, -1)
        : pathWithoutIndexSuffix;

    return {
      pathname: pathWithoutTrailingSlash,
      query,
    };
  });
}

function getQueryInterface(
  query: Route["query"]
): [query: string, requiredKeys: number] {
  let res = "{ ";
  let requiredKeys = 0;
  Object.entries(query).forEach(([key, value]) => {
    res += key;
    switch (value) {
      case "dynamic": {
        requiredKeys += 1;
        res += ": string";
        break;
      }
      case "catch-all": {
        requiredKeys += 1;
        res += ": string[]";
        break;
      }
      case "optional-catch-all": {
        res += "?: string[] | undefined";
        break;
      }
      // istanbul ignore next
      default: {
        const _exhaust: never = value;
        return _exhaust;
      }
    }
    res += "; ";
  });
  res += " }";
  return [res, requiredKeys];
}

export function generate(routes: Route[]): string {
  return `\
// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.'
// Run \`yarn nextjs-routes\` to regenerate this file.

type Route =
  | ${routes
    .map((route) => {
      const [query, requiredKeys] = getQueryInterface(route.query);
      if (requiredKeys > 0) {
        return `{ pathname: '${route.pathname}'; query: Query<${query}> }`;
      } else {
        return `{ pathname: '${route.pathname}'; query?: Query | undefined }`;
      }
    })
    .join("\n  | ")}

type Pathname = Route["pathname"];

type Query<Params = {}> = Params & {
  [key: string]: string;
}

type QueryForPathname = {
  [K in Route as K["pathname"]]: K["query"]
};

type RouteOrQuery = Route | { query: Query }

declare module "next/link" {
  import type { LinkProps as NextLinkProps } from "next/dist/client/link";
  import type { PropsWithChildren, MouseEventHandler } from "react";

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

declare module "next/router" {
  import type { NextRouter as Router } from "next/dist/client/router";
  export { RouterEvent } from "next/dist/client/router";

  type TransitionOptions = Parameters<Router["push"]>[2];

  export interface NextRouter<P extends Pathname = Pathname> extends Omit<Router, "push" | "replace"> {
    pathname: P;
    route: P; 
    query: QueryForPathname[P]
    push(url: RouteOrQuery, as?: string, options?: TransitionOptions): Promise<boolean>;
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
