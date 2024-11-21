import { route } from "./index.js";

describe(route, () => {
  describe("generates paths", () => {
    // prettier-ignore
    test.each([
      [{ pathname: "/404" },                                                                                         "/404"],
      [{ pathname: "/settings/about" },                                                                              "/settings/about"],
      // dynamic
      [{ pathname: "/foos/[foo]",            query: { foo: "bar" } },                                                "/foos/bar"],
      [{ pathname: "/foos/[foo]/bars/[bar]", query: { foo: "bar", bar: "baz" } },                                    "/foos/bar/bars/baz"],
      [{ pathname: "/[foo]/[bar]/[baz]",     query: { foo: "foo", bar: "bar", baz: "baz" } },                        "/foo/bar/baz"],
      // catch all
      [{ pathname: "/[...segments]",         query: { segments: ["foo"] } },                                         "/foo"],
      [{ pathname: "/[...segments]",         query: { segments: ["foo", "bar"] } },                                  "/foo/bar"],
      // optional catch all
      [{ pathname: "/[[...segments]]",       query: { segments: [] } },                                              "/"],
      [{ pathname: "/[[...segments]]",       query: { segments: undefined } },                                       "/"],
      [{ pathname: "/[[...segments]]/foos",  query: { segments: undefined } },                                       "/foos"],
      // query params
      [{ pathname: "/foos/[foo]",            query: { foo: "foo", bar: "bar" } },                                    "/foos/foo?bar=bar"],
      [{ pathname: "/foos/[foo]",            query: { foo: "foo", bar: "bar", baz: ["1", "2", "3"] } },              "/foos/foo?bar=bar&baz=1&baz=2&baz=3"],
      [{ pathname: "/foos/[foo]",            query: { foo: "foo", bar: "bar", baz: ["1", "2", "3"] }, hash: "foo" }, "/foos/foo?bar=bar&baz=1&baz=2&baz=3#foo"],
      [{ pathname: "/foos/[foo]",            query: { foo: "foo", bar: undefined, baz: '', foobar: '' } },           "/foos/foo?baz=&foobar="],
    ])("generates paths for %o", (input, expected) => {
      expect(route(input)).toEqual(expected);
    });
  });

  describe("options", () => {
    describe("trailingSlash", () => {
      describe.each([
        ["/settings/about", undefined, true, "/settings/about/"],
        ["/settings/about", undefined, false, "/settings/about"],
        ["/foos/[foo]", { foo: "bar" }, true, "/foos/bar/"],
        ["/foos/[foo]", { foo: "bar" }, false, "/foos/bar"],
      ])(
        "route(%p, { trailingSlash: %p })",
        (pathname, query, trailingSlash, expectedResult) => {
          it(`returns ${expectedResult}`, () => {
            expect(route({ pathname, query }, { trailingSlash })).toEqual(
              expectedResult,
            );
          });
        },
      );
    });
  });
});
