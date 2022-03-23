import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { PropsWithChildren } from "react";
import { Routes } from "./index";

export interface LinkProps extends Omit<NextLinkProps, "href"> {
  href: Routes;
}

type Link = (
  props: PropsWithChildren<LinkProps>
) => ReturnType<typeof NextLink>;

export const Link: Link = NextLink;
