import { existsSync, writeFileSync } from "fs";
import { writeNextJSRoutes } from "../core.js";
import { findFiles } from "../utils.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => false),
  mkdirSync: jest.fn(),
}));
const writeFileSyncMock = writeFileSync as jest.Mock;
const existsSyncMock = existsSync as jest.Mock;
jest.spyOn(process, "cwd").mockReturnValue("");

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("../utils.js", () => ({
  ...jest.requireActual("../utils.js"),
  findFiles: jest.fn(),
}));
const findFilesMock = findFiles as jest.Mock;

describe("route generation", () => {
  it("no routes", () => {
    // getPageRoutes
    existsSyncMock.mockImplementationOnce(() => true);
    findFilesMock.mockReturnValueOnce([]);
    writeNextJSRoutes({});
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  it("transforms windows paths", () => {
    // getPageRoutes src/pages
    existsSyncMock
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);
    findFilesMock.mockReturnValueOnce(["src\\pages\\[foo]\\bar\\index.ts"]);
    writeNextJSRoutes({});
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  it("dedupes", () => {
    // getPageRoutes
    existsSyncMock.mockImplementationOnce(() => true);
    findFilesMock.mockReturnValueOnce(["pages/index.tsx", "pages/index.ts"]);
    writeNextJSRoutes({});
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  it("typescript", () => {
    // getPageRoutes
    existsSyncMock.mockImplementationOnce(() => true);
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
    writeNextJSRoutes({});
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  describe("app directory", () => {
    it("generates routes", () => {
      // getAppRoutes
      existsSyncMock
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => true);
      findFilesMock.mockReturnValueOnce([
        "app/page.ts",
        "app/bar/page.ts",
        "app/foo/page.tsx",
        "app/foobar/page.js",
        "app/barbaz/page.jsx",
        "app/baz/route.js",
        "app/foobaz/route.ts",
      ]);
      writeNextJSRoutes({});
      expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
    });

    it("handles intercept routes", () => {
      // getAppRoutes
      existsSyncMock
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => true);
      findFilesMock.mockReturnValueOnce([
        "app/(..)photo/[id]/page.ts",
        "app/photo/[id]/page.ts",
        "app/foo/(...)bar/page.ts",
        "app/foobar/(.)baz/page.ts",
        "app/foobar/(..)baz/page.ts",
      ]);
      writeNextJSRoutes({});
      expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
    });

    it("handles parallel routes", () => {
      // getAppRoutes
      existsSyncMock
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => true);
      findFilesMock.mockReturnValueOnce([
        "app/@team/settings/page.ts",
        "app/@analytics/page.ts",
      ]);
      writeNextJSRoutes({});
      expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
    });

    it("handles windows paths", () => {
      // get AppRoutes
      existsSyncMock
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => true);
      findFilesMock.mockReturnValueOnce(["app\\[foo]\\bar\\page.ts"]);
      writeNextJSRoutes({});
      expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
    });
  });

  describe("pages and app directory", () => {
    it("generates routes", () => {
      existsSyncMock
        // getPageRoutes
        .mockImplementationOnce(() => true)
        // getAppRoutes
        .mockImplementationOnce(() => true);
      findFilesMock
        // page routes
        .mockReturnValueOnce(["pages/[foo].ts"])
        // app routes
        .mockReturnValueOnce(["app/bar/page.ts", "app/page.ts"]);
      writeNextJSRoutes({});
      expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
    });
  });

  describe("configuration", () => {
    describe("pageExtensions", () => {
      it("default", () => {
        // getPageRoutes
        existsSyncMock.mockImplementationOnce(() => true);
        findFilesMock.mockReturnValueOnce(["pages/404.ts", "pages/404.md"]);
        writeNextJSRoutes({});
        expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
      });

      it("configured", () => {
        // getPageRoutes
        existsSyncMock.mockImplementationOnce(() => true);
        findFilesMock.mockReturnValueOnce([
          "pages/404.ts",
          "pages/index.md",
          "pages/foo/index.page.tsx",
          "pages/foo/index.test.tsx",
        ]);
        writeNextJSRoutes({
          pageExtensions: ["ts", "md", "page.tsx"],
        });
        expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
      });
    });

    it("outDir", () => {
      // getPageRoutes
      existsSyncMock.mockImplementationOnce(() => true);
      findFilesMock.mockReturnValueOnce(["pages/404.ts"]);
      writeNextJSRoutes({ outDir: "src" });
      expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
    });

    it("i18n", () => {
      // getPageRoutes
      existsSyncMock.mockImplementationOnce(() => true);
      findFilesMock.mockReturnValueOnce(["pages/index.ts"]);
      writeNextJSRoutes({
        i18n: {
          locales: ["en-US", "fr", "nl-NL"],
          defaultLocale: "en-US",
          domains: [
            {
              domain: "example.nl",
              defaultLocale: "nl-NL",
              locales: ["nl-BE"],
            },
            {
              domain: "example.fr",
              defaultLocale: "fr",
              http: true,
            },
          ],
        },
      });
      expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
    });
  });
});
