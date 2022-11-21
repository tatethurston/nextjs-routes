import { route } from "./index.js";

describe(route, () => {
  it("generates paths", () => {
    // static
    expect(route({ pathname: "/404" })).toEqual("/404");
    expect(route({ pathname: "/settings/about" })).toEqual("/settings/about");
    // dynamic
    expect(route({ pathname: "/foos/[foo]", query: { foo: "bar" } })).toEqual(
      "/foos/bar"
    );
    expect(
      route({
        pathname: "/foos/[foo]/bars/[bar]",
        query: { foo: "bar", bar: "baz" },
      })
    ).toEqual("/foos/bar/bars/baz");
    expect(
      route({
        pathname: "/[foo]/[bar]/[baz]",
        query: { foo: "foo", bar: "bar", baz: "baz" },
      })
    ).toEqual("/foo/bar/baz");
    // catch all
    expect(
      route({ pathname: "/[...segments]", query: { segments: ["foo"] } })
    ).toEqual("/foo");
    expect(
      route({ pathname: "/[...segments]", query: { segments: ["foo", "bar"] } })
    ).toEqual("/foo/bar");
    // optional catch all
    expect(
      route({ pathname: "/[[...segments]]", query: { segments: [] } })
    ).toEqual("/");
    expect(
      route({ pathname: "/[[...segments]]", query: { segments: undefined } })
    ).toEqual("/");
    expect(
      route({
        pathname: "/[[...segments]]/foos",
        query: { segments: undefined },
      })
    ).toEqual("/foos");
    // query params
    expect(
      route({ pathname: "/foos/[foo]", query: { foo: "foo", bar: "bar" } })
    ).toEqual("/foos/foo?bar=bar");
    expect(
      route({
        pathname: "/foos/[foo]",
        query: { foo: "foo", bar: "bar", baz: ["1", "2", "3"] },
      })
    ).toEqual("/foos/foo?bar=bar&baz=1&baz=2&baz=3");
    expect(
      route({
        pathname: "/foos/[foo]",
        query: { foo: "foo", bar: "bar", baz: ["1", "2", "3"] },
        hash: "foo",
      })
    ).toEqual("/foos/foo?bar=bar&baz=1&baz=2&baz=3#foo");
  });
});
