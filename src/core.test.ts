import { existsSync, writeFileSync } from "fs";
import { writeNextjsRoutes } from "./core.js";
import { findFiles } from "./utils.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => false),
  mkdirSync: jest.fn(),
}));
const writeFileSyncMock = writeFileSync as jest.Mock;
const existsSyncMock = existsSync as jest.Mock;

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("./utils.js", () => ({
  ...jest.requireActual("./utils.js"),
  findFiles: jest.fn(),
}));
const findFilesMock = findFiles as jest.Mock;

describe("route generation", () => {
  it("no routes", () => {
    // getPageRoutes
    existsSyncMock.mockImplementationOnce(() => true);
    findFilesMock.mockReturnValueOnce([]);
    writeNextjsRoutes({});
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  it("transforms windows paths", () => {
    // getPageRoutes src/pages
    existsSyncMock
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);
    findFilesMock.mockReturnValueOnce(["src\\pages\\[foo]\\bar\\index.ts"]);
    writeNextjsRoutes({});
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  it("dedupes", () => {
    // getPageRoutes
    existsSyncMock.mockImplementationOnce(() => true);
    findFilesMock.mockReturnValueOnce(["pages/index.tsx", "pages/index.ts"]);
    writeNextjsRoutes({});
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
    writeNextjsRoutes({});
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  it("app directory (experimental)", () => {
    // getAppRoutes
    existsSyncMock
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);
    findFilesMock.mockReturnValueOnce(["app/foo/page.tsx", "app/bar/page.ts"]);
    writeNextjsRoutes({});
    expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
  });

  describe("configuration", () => {
    describe("pageExtensions", () => {
      it("default", () => {
        // getPageRoutes
        existsSyncMock.mockImplementationOnce(() => true);
        findFilesMock.mockReturnValueOnce(["pages/404.ts", "pages/404.md"]);
        writeNextjsRoutes({});
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
        writeNextjsRoutes({
          pageExtensions: ["ts", "md", "page.tsx"],
        });
        expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
      });
    });

    it("outDir", () => {
      // getPageRoutes
      existsSyncMock.mockImplementationOnce(() => true);
      findFilesMock.mockReturnValueOnce(["pages/404.ts"]);
      writeNextjsRoutes({ outDir: "src" });
      expect(writeFileSyncMock.mock.calls).toMatchSnapshot();
    });

    it("i18n", () => {
      // getPageRoutes
      existsSyncMock.mockImplementationOnce(() => true);
      findFilesMock.mockReturnValueOnce(["pages/index.ts"]);
      writeNextjsRoutes({
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
