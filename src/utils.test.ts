import { nextRoutes, generate } from "./utils.js";

describe("nextRoutes", () => {
  it("transforms windows paths", () => {
    const pages = ["src\\pages\\[foo]\\bar\\index.ts"];
    const { pathname } = nextRoutes(pages, "src\\pages")[0];
    expect(pathname).toEqual("/[foo]/bar");
  });
});

describe("route generation", () => {
  it("no routes", () => {
    expect(generate(nextRoutes([], "pages"))).toMatchSnapshot();
  });

  it("typescript", () => {
    const pages = [
      "pages/404.ts",
      "pages/[foo].ts",
      "pages/[foo]/[bar]/[baz].ts",
      "pages/[foo]/bar/[baz].ts",
      "pages/[foo]/bar/[baz]/foo/[bar].ts",
      "pages/[foo]/baz.ts",
      "pages/_app.ts",
      "pages/middleware.ts",
      "pages/_debug.ts",
      "pages/_debug/health-check.ts",
      "pages/_document.ts",
      "pages/_error.ts",
      "pages/_error/index.ts",
      "pages/api/[[...segments]].ts",
      "pages/api/[...segments].ts",
      "pages/api/bar.ts",
      "pages/foo/[slug].ts",
      "pages/index.ts",
      "pages/not-found.ts",
      "pages/settings/bars/[bar].ts",
      "pages/settings/bars/[bar]/baz.ts",
      "pages/settings/foo.ts",
      "pages/settings/index.ts",
    ];
    expect(generate(nextRoutes(pages, "pages"))).toMatchSnapshot();
  });
});
