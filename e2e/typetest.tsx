import Link from "next/link";
import { LinkProps } from "next/link";
import { useRouter, RouterEvent, NextRouter } from "next/router";
import type { Route } from "nextjs-routes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
function expectType<T>(_value: T) {}

// next/link

// Path without dynamic segments
<Link href={{ pathname: "/" }} />;
<Link href={{ pathname: "/", query: undefined }} />;
<Link href={{ pathname: "/", query: {} }} />;
<Link href={{ pathname: "/", query: { bar: "baz" } }} />;
<Link href={{ pathname: "/", query: { bar: undefined } }} />;
<Link href={{ pathname: "/", query: { bar: ["baz", "foo"] } }} />;

// Path with dynamic segments
<Link href={{ pathname: "/foos/[foo]", query: { foo: "baz" } }} />;

// @ts-expect-error missing 'foo' in query
<Link href={{ pathname: "/foos/[foo]", query: { bar: "baz" } }} />;
// @ts-expect-error missing 'foo' in query
<Link href={{ pathname: "/foos/[foo]", query: undefined }} />;
// @ts-expect-error missing 'foo' in query
<Link href={{ pathname: "/foos/[foo]", query: {} }} />;
<Link href={{ pathname: "/foos/[foo]", query: { foo: "baz", bar: "baz" } }} />;
// @ts-expect-error 'foo' must be a string, not string[]
<Link href={{ pathname: "/foos/[foo]", query: { foo: ["baz", "foo"] } }} />;

// Only change query for current page
<Link href={{ query: { bar: "baz" } }} />;
<Link href={{ query: { foo: "foo" } }} />;
<Link href={{ query: { foo: ["foo", "bar"] } }} />;

// Unaugmented props
<Link
  href={{ query: {} }}
  replace
  scroll
  shallow
  passHref
  prefetch
  locale="en"
  legacyBehavior={false}
  onClick={console.log}
  onMouseEnter={console.log}
  children="Link"
/>;
// @ts-expect-error replace typo
<Link href={{ query: {} }} replacey />;

// LinkProps

// ensure LinkProps is our LinkProps, not the untyped one

expectType<LinkProps["href"]>({ pathname: "/" });

// @ts-expect-error invalid pathname
expectType<LinkProps["href"]>({ pathname: "/invalid" });

// next/router
const router = useRouter();

// pathname

expectType<"/" | "/foos/[foo]">(router.pathname);

// route

expectType<"/" | "/foos/[foo]">(router.route);

// query

expectType<string | string[] | undefined>(router.query.foo);
expectType<string | string[] | undefined>(router.query.bar);
// type narrowing
expectType<string>(useRouter<"/foos/[foo]">().query.foo);

// push

// Path without dynamic segments
router.push({ pathname: "/" });
router.push({ pathname: "/", query: undefined });
router.push({ pathname: "/", query: {} });
router.push({ pathname: "/", query: { bar: "baz" } });
router.push({ pathname: "/", query: { bar: ["foo", "baz"] } });

// Path with dynamic segments
router.push({ pathname: "/foos/[foo]", query: { foo: "baz" } });
// @ts-expect-error missing 'foo' in query
router.push({ pathname: "/foos/[foo]", query: { bar: "baz" } });
// @ts-expect-error missing 'foo' in query
router.push({ pathname: "/foos/[foo]", query: undefined });
// @ts-expect-error missing 'foo' in query
router.push({ pathname: "/foos/[foo]", query: {} });
router.push({ pathname: "/foos/[foo]", query: { foo: "baz", bar: "baz" } });
// @ts-expect-error 'foo' must be a string, not string[]
router.push({ pathname: "/foos/[foo]", query: { foo: ["bar", "baz"] } });

// Only change query for current page
router.push({ query: { bar: "baz" } });
router.push({ query: { foo: "foo" } });
router.push({ query: { foo: ["foo", "bar"] } });

// Unaugmented options
router.push({ query: {} }, undefined, {
  shallow: true,
  locale: "en",
  scroll: true,
});
// @ts-expect-error shallow typo
router.push({ query: {} }, undefined, { shallowy: true });

// replace

// Path without dynamic segments
router.replace({ pathname: "/" });
router.replace({ pathname: "/", query: undefined });
router.replace({ pathname: "/", query: {} });
router.replace({ pathname: "/", query: { bar: "baz" } });
router.replace({ pathname: "/", query: { bar: ["foo", "baz"] } });

// Path with dynamic segments
router.replace({ pathname: "/foos/[foo]", query: { foo: "baz" } });
// @ts-expect-error missing 'foo' in query
router.replace({ pathname: "/foos/[foo]", query: { bar: "baz" } });
// @ts-expect-error missing 'foo' in query
router.replace({ pathname: "/foos/[foo]", query: undefined });
// @ts-expect-error missing 'foo' in query
router.replace({ pathname: "/foos/[foo]", query: {} });
router.replace({ pathname: "/foos/[foo]", query: { foo: "baz", bar: "baz" } });
// @ts-expect-error 'foo' must be a string, not string[]
router.replace({ pathname: "/foos/[foo]", query: { foo: ["bar", "baz"] } });

// Only change query for current page
router.replace({ query: { bar: "baz" } });
router.replace({ query: { foo: "foo" } });
router.replace({ query: { foo: ["bar", "baz"] } });

// Unaugmented options
router.replace({ query: {} }, undefined, {
  shallow: true,
  locale: "en",
  scroll: true,
});
// @ts-expect-error shallow typo
router.replace({ query: {} }, undefined, { shallowy: true });

// RouterEvent

let routerEvent: RouterEvent;

routerEvent = "routeChangeStart";
// @ts-expect-error event typo
routerEvent = "routeChangeStarty";

// NextRouter

// ensure NextRouter is our NextRouter, not the untyped one

let nextRouter: NextRouter = undefined as unknown as NextRouter;

nextRouter.push({ pathname: "/" });

// @ts-expect-error invalid pathname
nextRouter.push({ pathname: "/invalid" });

// nextjs-routes

// Route

let route: Route;

// Path without dynamic segments
route = { pathname: "/" };
route = { pathname: "/", query: undefined };
route = { pathname: "/", query: {} };
route = { pathname: "/", query: { bar: "baz" } };
route = { pathname: "/", query: { bar: ["foo", "baz"] } };

// Path with dynamic segments
route = { pathname: "/foos/[foo]", query: { foo: "baz" } };
// @ts-expect-error missing 'foo' in query
route = { pathname: "/foos/[foo]", query: { bar: "baz" } };
// @ts-expect-error missing 'foo' in query
route = { pathname: "/foos/[foo]", query: undefined };
// @ts-expect-error missing 'foo' in query
route = { pathname: "/foos/[foo]", query: {} };
route = { pathname: "/foos/[foo]", query: { foo: "baz", bar: "baz" } };
// @ts-expect-error 'foo' must be a string, not string[]
route = { pathname: "/foos/[foo]", query: { foo: ["bar", "baz"] } };
