// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
// This file will be automatically regenerated when your Next.js server is running.
// nextjs-routes version: 2.2.5
/* eslint-disable */

// prettier-ignore
declare module "nextjs-routes" {
  import type {
    GetServerSidePropsContext as NextGetServerSidePropsContext,
    GetServerSidePropsResult as NextGetServerSidePropsResult
  } from "next";

  export type Route =
    | StaticRoute<"/">
    | DynamicRoute<"/[store]", { "store": string }>;

  interface StaticRoute<Pathname> {
    pathname: Pathname;
    query?: Query | undefined;
    hash?: string | null | undefined;
  }

  interface DynamicRoute<Pathname, Parameters> {
    pathname: Pathname;
    query: Parameters & Query;
    hash?: string | null | undefined;
  }

  interface Query {
    [key: string]: string | string[] | undefined;
  };

  export type RoutedQuery<P extends Route["pathname"] = Route["pathname"]> = Extract<
    Route,
    { pathname: P }
  >["query"];

  export type Locale = undefined;

  type Brand<K, T> = K & { __brand: T };

  /**
   * A string that is a valid application route.
   */
  export type RouteLiteral = Brand<string, "RouteLiteral">

  /**
   * A typesafe utility function for generating paths in your application.
   *
   * route({ pathname: "/foos/[foo]", query: { foo: "bar" }}) will produce "/foos/bar".
   */
  export declare function route(r: Route): RouteLiteral;

  /**
   * Nearly identical to GetServerSidePropsContext from next, but further narrows
   * types based on nextjs-route's route data.
   */
  export type GetServerSidePropsContext<
    Pathname extends Route["pathname"] = Route["pathname"],
    Preview extends NextGetServerSidePropsContext["previewData"] = NextGetServerSidePropsContext["previewData"]
  > = Omit<NextGetServerSidePropsContext, 'params' | 'query' | 'defaultLocale' | 'locale' | 'locales'> & {
    params: Extract<Route, { pathname: Pathname }>["query"];
    query: Query;
    defaultLocale?: undefined;
    locale?: Locale;
    locales?: undefined;
  };

  /**
   * Nearly identical to GetServerSideProps from next, but further narrows
   * types based on nextjs-route's route data.
   */
  export type GetServerSideProps<
    Props extends { [key: string]: any } = { [key: string]: any },
    Pathname extends Route["pathname"] = Route["pathname"],
    Preview extends NextGetServerSideProps["previewData"] = NextGetServerSideProps["previewData"]
  > = (
    context: GetServerSidePropsContext<Pathname, Preview>
  ) => Promise<NextGetServerSidePropsResult<Props>>
}

// prettier-ignore
declare module "next/link" {
  import type { Route, RouteLiteral } from "nextjs-routes";;
  import type { LinkProps as NextLinkProps } from "next/dist/client/link";
  import type React from "react";

  type StaticRoute = Exclude<Route, { query: any }>["pathname"];

  export type LinkProps = Omit<NextLinkProps, "href" | "locale"> & {
    href: StaticRoute | RouteLiteral;
    locale?: false;
  }

  /**
   * A React component that extends the HTML `<a>` element to provide [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
   * and client-side navigation between routes.
   *
   * It is the primary way to navigate between routes in Next.js.
   *
   * Read more: [Next.js docs: `<Link>`](https://nextjs.org/docs/app/api-reference/components/link)
   */
  declare const Link: React.ForwardRefExoticComponent<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & {
      children?: React.ReactNode;
  } & React.RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

// prettier-ignore
declare module "next/router" {
  import type { Locale, Route, RoutedQuery } from "nextjs-routes";
  import type { NextRouter as Router } from "next/dist/client/router";
  export * from "next/dist/client/router";
  export { default } from "next/dist/client/router";

  type NextTransitionOptions = NonNullable<Parameters<Router["push"]>[2]>;
  type StaticRoute = Exclude<Route, { query: any }>["pathname"];

  interface TransitionOptions extends Omit<NextTransitionOptions, "locale"> {
    locale?: false;
  }

  type PathnameAndQuery<Pathname> = Required<
    Pick<Extract<Route, { pathname: Pathname }>, "pathname" | "query">
  >;

  type AutomaticStaticOptimizedQuery<PaQ> = Omit<PaQ, "query"> & {
    query: Partial<PaQ["query"]>;
  };

  type BaseRouter<PaQ> =
    | ({ isReady: false } & AutomaticStaticOptimizedQuery<PaQ>)
    | ({ isReady: true } & PaQ);

  export type NextRouter<P extends Route["pathname"] = Route["pathname"]> =
    BaseRouter<PathnameAndQuery<P>> &
      Omit<
        Router,
        | "defaultLocale"
        | "domainLocales"
        | "isReady"
        | "locale"
        | "locales"
        | "pathname"
        | "push"
        | "query"
        | "replace"
        | "route"
      > & {
        defaultLocale?: undefined;
        domainLocales?: undefined;
        locale?: Locale;
        locales?: undefined;
        push(
          url: Route | StaticRoute | Omit<Route, "pathname">,
          as?: string,
          options?: TransitionOptions
        ): Promise<boolean>;
        replace(
          url: Route | StaticRoute | Omit<Route, "pathname">,
          as?: string,
          options?: TransitionOptions
        ): Promise<boolean>;
        route: P;
      };

  export function useRouter<P extends Route["pathname"]>(): NextRouter<P>;
}

// prettier-ignore
declare module "next/navigation" {
  export * from "next/dist/client/components/navigation";
  import type { Route, RouteLiteral, RoutedQuery } from "nextjs-routes";
  import type { AppRouterInstance as NextAppRouterInstance, NavigateOptions, PrefetchOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";

  type StaticRoute = Exclude<Route, { query: any }>["pathname"];

  /**
   * A [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) hook
   * that lets you read the current URL's pathname.
   *
   * @example
   * ```ts
   * "use client"
   * import { usePathname } from 'next/navigation'
   *
   * export default function Page() {
   *  const pathname = usePathname() // returns "/dashboard" on /dashboard?foo=bar
   *  // ...
   * }
   * ```
   *
   * Read more: [Next.js Docs: `usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
   */
  export const usePathname: () => RouteLiteral;

  type AppRouterInstance = Omit<NextAppRouterInstance, 'push' | 'replace' | 'href'> & {
    push(href: StaticRoute | RouteLiteral, options?: NavigateOptions): void;
    replace(href: StaticRoute | RouteLiteral, options?: NavigateOptions): void;
    prefetch(href: StaticRoute | RouteLiteral, options?: PrefetchOptions): void;
  }

  /**
   *
   * This hook allows you to programmatically change routes inside [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components).
   *
   * @example
   * ```ts
   * "use client"
   * import { useRouter } from 'next/navigation'
   *
   * export default function Page() {
   *  const router = useRouter()
   *  // ...
   *  router.push('/dashboard') // Navigate to /dashboard
   * }
   * ```
   *
   * Read more: [Next.js Docs: `useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router)
   */
  export function useRouter(): AppRouterInstance;

  /**
   * A [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components) hook
   * that lets you read a route's dynamic params filled in by the current URL.
   *
   * @example
   * ```ts
   * "use client"
   * import { useParams } from 'next/navigation'
   *
   * export default function Page() {
   *   // on /dashboard/[team] where pathname is /dashboard/nextjs
   *   const { team } = useParams() // team === "nextjs"
   * }
   * ```
   *
   * Read more: [Next.js Docs: `useParams`](https://nextjs.org/docs/app/api-reference/functions/use-params)
   */
  export const useParams: <Pathname extends Route["pathname"] = Route["pathname"]>() => RoutedQuery<Pathname>;
}
