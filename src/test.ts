import { nextRoutes, generate } from "./utils.js";

describe("nextRoutes", () => {
  it("transforms windows paths", () => {
    const pages = ["\\[foo]\\bar\\index.ts"];
    const { pathname } = nextRoutes(pages)[0];
    expect(pathname).toEqual("/[foo]/bar");
  });
});

describe("route generation", () => {
  it("typescript", () => {
    const pages = [
      "/404.ts",
      "/[foo].ts",
      "/[foo]/[bar]/[baz].ts",
      "/[foo]/bar/[baz].ts",
      "/[foo]/bar/[baz]/foo/[bar].ts",
      "/[foo]/baz.ts",
      "/_app.ts",
      "/_debug.ts",
      "/_debug/health-check.ts",
      "/_document.ts",
      "/_error.ts",
      "/_error/index.ts",
      "/api/[[...segments]].ts",
      "/api/[...segments].ts",
      "/api/bar.ts",
      "/foo/[slug].ts",
      "/index.ts",
      "/not-found.ts",
      "/settings/bars/[bar].ts",
      "/settings/bars/[bar]/baz.ts",
      "/settings/foo.ts",
      "/settings/index.ts",
    ];
    expect(generate(nextRoutes(pages))).toMatchSnapshot();
  });
});
