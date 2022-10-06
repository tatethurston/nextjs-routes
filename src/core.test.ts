import { writeFileSync } from "fs";
import { nextRoutes, writeNextjsRoutes } from "./core.js";
import { findFiles } from "./utils.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
}));
const writeFileSyncMock = writeFileSync as jest.Mock;

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("./utils.js", () => ({
  ...jest.requireActual("./utils.js"),
  findFiles: jest.fn(),
}));
const findFilesMock = findFiles as jest.Mock;

describe("nextRoutes", () => {
  it("transforms windows paths", () => {
    const pages = ["src\\pages\\[foo]\\bar\\index.ts"];
    const { pathname } = nextRoutes(pages, "src\\pages")[0];
    expect(pathname).toEqual("/[foo]/bar");
  });

  it("colocated test files", () => {
    const pages = ["pages/index.tsx", "pages/index.test.tsx"];
    expect(nextRoutes(pages, "pages")).toMatchInlineSnapshot(`
      [
        {
          "pathname": "/",
          "query": {},
        },
      ]
    `);
  });
});

describe("route generation", () => {
  it("no routes", () => {
    findFilesMock.mockReturnValueOnce([]);
    writeNextjsRoutes({ pagesDirectory: "pages" });
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  it("typescript", () => {
    findFilesMock.mockReturnValueOnce([
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
    ]);
    writeNextjsRoutes({ pagesDirectory: "pages" });
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  describe("pageExtensions", () => {
    it("default", () => {
      findFilesMock.mockReturnValueOnce(["pages/404.ts", "pages/404.md"]);
      writeNextjsRoutes({ pagesDirectory: "pages" });
      expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
    });

    it("configured", () => {
      findFilesMock.mockReturnValueOnce(["pages/404.ts", "pages/index.md", "pages/foo/index.page.tsx", "pages/foo/index.test.tsx"]);
      writeNextjsRoutes({
        pagesDirectory: "pages",
        pageExtensions: ["ts", "md", "page.tsx"],
      });
      expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
    });
  });

  it("outDir", () => {
    findFilesMock.mockReturnValueOnce(["pages/404.ts"]);
    writeNextjsRoutes({ pagesDirectory: "pages", outDir: "src" });
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });
});
