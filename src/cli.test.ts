import { getPagesDirectory } from "./utils.js";

jest.mock("./utils", () => ({
  getPagesDirectory: jest.fn(),
}));

const consoleError = jest
  .spyOn(console, "error")
  .mockImplementationOnce(() => undefined);

const processExit = jest
  .spyOn(process, "exit")
  .mockImplementationOnce(() => undefined as never);

(getPagesDirectory as jest.Mock).mockImplementation(() => undefined);

describe("cli", () => {
  it("missing pages directory", async () => {
    await import("./cli");
    expect(consoleError.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
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
