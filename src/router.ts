import { useRouter as useNextRouter, NextRouter } from "next/router";
import type { Routes } from "./index";

type TransitionOptions = Parameters<NextRouter["push"]>[2];

export interface Router extends Omit<NextRouter, "push" | "replace"> {
  push(url: Routes, as?: Routes, options?: TransitionOptions): Promise<boolean>;
  replace(
    url: Routes,
    as?: Routes,
    options?: TransitionOptions
  ): Promise<boolean>;
}

export const useRouter: () => Router = useNextRouter;
