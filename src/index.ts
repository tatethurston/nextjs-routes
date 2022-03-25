import type { NextRouter } from "next/router";
import type { PropsWithChildren } from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";

export type NextUrl<
  Pathname extends string = string,
  Query = Record<string, never>
> = Partial<URL> & Query extends Record<string, never>
  ? {
      pathname: Pathname;
      query?: Query;
    }
  : {
      pathname: Pathname;
      query: Query;
    };

type TransitionOptions = Parameters<NextRouter["push"]>[2];

export interface Router<Routes extends NextUrl>
  extends Omit<NextRouter, "push" | "replace"> {
  push(url: Routes, as?: Routes, options?: TransitionOptions): Promise<boolean>;
  replace(
    url: Routes,
    as?: Routes,
    options?: TransitionOptions
  ): Promise<boolean>;
}

interface LinkProps<Routes extends NextUrl>
  extends Omit<NextLinkProps, "href"> {
  href: Routes;
}

export type RouteLink<Routes extends NextUrl> = (
  props: PropsWithChildren<LinkProps<Routes>>
) => ReturnType<typeof NextLink>;
