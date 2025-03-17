import { logger } from "../logger.js";

describe("logger", () => {
  describe("#error", () => {
    it("prefixes with [nextjs-routes]", () => {
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      logger.error("Some error");
      expect(consoleError).toHaveBeenCalledWith("[nextjs-routes] Some error");
    });
  });

  describe("#info", () => {
    it("prefixes with [nextjs-routes]", () => {
      const consoleInfo = jest
        .spyOn(console, "info")
        .mockImplementation(() => {});

      logger.info("Some info");
      expect(consoleInfo).toHaveBeenCalledWith("[nextjs-routes] Some info");
    });
  });
});
