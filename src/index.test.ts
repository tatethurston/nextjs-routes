import { route } from "./index.js";

describe(route, () => {
  it("generates paths", () => {
    // static
    expect(route({ pathname: "/404" })).toMatchInlineSnapshot(`"/404"`);
    expect(route({ pathname: "/settings/about" })).toMatchInlineSnapshot(
      `"/settings/about"`
    );
    // dynamic
    expect(
      route({ pathname: "/foos/[foo]", query: { foo: "bar" } })
    ).toMatchInlineSnapshot(`"/foos/bar"`);
    expect(
      route({
        pathname: "/foos/[foo]/bars/[bar]",
        query: { foo: "bar", bar: "baz" },
      })
    ).toMatchInlineSnapshot(`"/foos/bar/bars/baz"`);
    expect(
      route({
        pathname: "/[foo]/[bar]/[baz]",
        query: { foo: "foo", bar: "bar", baz: "baz" },
      })
    ).toMatchInlineSnapshot(`"/foo/bar/baz"`);
    // catch all
    expect(
      route({ pathname: "/[...segments]", query: { segments: ["foo"] } })
    ).toMatchInlineSnapshot(`"/foo"`);
    expect(
      route({ pathname: "/[...segments]", query: { segments: ["foo", "bar"] } })
    ).toMatchInlineSnapshot(`"/foo/bar"`);
    // optional catch all
    expect(
      route({ pathname: "/[[...segments]]", query: { segments: [] } })
    ).toMatchInlineSnapshot(`"/"`);
    expect(
      route({ pathname: "/[[...segments]]", query: { segments: undefined } })
    ).toMatchInlineSnapshot(`"/"`);
    expect(
      route({
        pathname: "/[[...segments]]/foos",
        query: { segments: undefined },
      })
    ).toMatchInlineSnapshot(`"/foos"`);
    // query params
    expect(
      route({ pathname: "/foos/[foo]", query: { foo: "foo", bar: "bar" } })
    ).toMatchInlineSnapshot(`"/foos/foo?bar=bar"`);
    expect(
      route({
        pathname: "/foos/[foo]",
        query: { foo: "foo", bar: "bar", baz: ["1", "2", "3"] },
      })
    ).toMatchInlineSnapshot(`"/foos/foo?bar=bar&baz=1&baz=2&baz=3"`);
  });
});
