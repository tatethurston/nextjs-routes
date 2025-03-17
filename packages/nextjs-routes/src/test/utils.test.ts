import {
  getPagesDirectory,
  getAppDirectory,
  findFiles,
  isNotUndefined,
} from "../utils.js";
import mockFS from "mock-fs";

describe(getPagesDirectory, () => {
  afterEach(() => {
    mockFS.restore();
  });

  it("finds pages in top level of directory", () => {
    mockFS({
      "/my-dir": {
        pages: {
          "file1.js": "content1",
        },
      },
    });

    expect(getPagesDirectory("/my-dir")).toEqual("/my-dir/pages");
  });

  it("finds pages in src directory", () => {
    mockFS({
      "/my-dir": {
        src: {
          pages: {
            "file1.js": "content1",
          },
        },
      },
    });

    expect(getPagesDirectory("/my-dir")).toEqual("/my-dir/src/pages");
  });
});

describe(getAppDirectory, () => {
  afterEach(() => {
    mockFS.restore();
  });

  it("finds app in top level of directory", () => {
    mockFS({
      "/my-dir": {
        app: {
          "file1.js": "content1",
        },
      },
    });

    expect(getAppDirectory("/my-dir")).toEqual("/my-dir/app");
  });

  it("finds app in src directory", () => {
    mockFS({
      "/my-dir": {
        src: {
          app: {
            "file1.js": "content1",
          },
        },
      },
    });

    expect(getAppDirectory("/my-dir")).toEqual("/my-dir/src/app");
  });
});

describe(findFiles, () => {
  afterEach(() => {
    mockFS.restore();
  });

  it("return a list of files in a directory", () => {
    mockFS({
      "/my-dir": {
        "file1.js": "content1",
        "file2.js": "content2",
        "sub-dir": {
          "file3.js": "content3",
        },
      },
    });

    expect(findFiles("/my-dir")).toEqual([
      "/my-dir/file1.js",
      "/my-dir/file2.js",
      "/my-dir/sub-dir/file3.js",
    ]);
  });

  it("ignores node_modules", () => {
    mockFS({
      "/my-dir": {
        "file1.js": "content1",
        node_modules: {
          "file2.js": "content2",
        },
      },
    });

    expect(findFiles("/my-dir")).toEqual(["/my-dir/file1.js"]);
  });
});

describe(isNotUndefined, () => {
  it("true when not undefined", () => {
    expect(isNotUndefined("hello")).toBe(true);
  });

  it("false when undefined", () => {
    expect(isNotUndefined(undefined)).toBe(false);
  });
});
