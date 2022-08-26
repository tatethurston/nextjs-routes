import { writeFileSync } from "fs";
import { cli, nextRoutes } from "./core.js";
import { findFiles, getPagesDirectory } from "./utils.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  writeFileSync: jest.fn(),
}));
const writeFileSyncMock = writeFileSync as jest.Mock;

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("./utils.js", () => ({
  ...jest.requireActual("./utils.js"),
  findFiles: jest.fn(),
  getPagesDirectory: jest.fn(),
}));
const getPagesDirectoryMock = getPagesDirectory as jest.Mock;
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
    getPagesDirectoryMock.mockReturnValueOnce("pages");
    findFilesMock.mockReturnValueOnce([]);
    cli();
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  it("typescript", () => {
    getPagesDirectoryMock.mockReturnValueOnce("pages");
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
    cli();
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  const consoleError = jest
    .spyOn(console, "error")
    .mockReturnValueOnce(undefined);

  const processExit = jest
    .spyOn(process, "exit")
    .mockReturnValueOnce(undefined as never);

  it("missing pages directory", () => {
    getPagesDirectoryMock.mockReturnValueOnce(undefined);
    cli();
    expect(consoleError.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "[nextjs-routes] Could not find a Next.js pages directory. Expected to find either pages(1) or src/pages(2).

        1. https://nextjs.org/docs/basic-features/pages
        2. https://nextjs.org/docs/advanced-features/src-directory
        ",
        ],
      ]
    `);
    expect(processExit).toHaveBeenCalledWith(1);
  });
});
