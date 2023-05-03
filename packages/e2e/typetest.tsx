import Link from "next/link";
import { LinkProps } from "next/link";
import { useRouter, RouterEvent, NextRouter } from "next/router";
import {
  route,
  type Route,
  type RoutedQuery,
  type GetServerSideProps,
  type GetServerSidePropsContext,
} from "nextjs-routes";
import nextRoutes from "nextjs-routes/config";

nextRoutes();
nextRoutes({});
nextRoutes({ outDir: "types" });
// @ts-expect-error invalid key 'foo'
nextRoutes({ foo: false });

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
function expectType<T>(_value: T) {}

// next/link

// Links with string hrefs
<Link href="/" />;
// @ts-expect-error dynamic paths are only valid with a UrlObject
<Link href="/foos/[foo]" />;
// @ts-expect-error bar isn't a valid path name
<Link href="/bar" />;

// Path without dynamic segments
<Link href={{ pathname: "/" }} />;
<Link href={{ pathname: "/", query: undefined }} />;
<Link href={{ pathname: "/", query: {} }} />;
<Link href={{ pathname: "/", query: { bar: "baz" } }} />;
<Link href={{ pathname: "/", query: { bar: undefined } }} />;
<Link href={{ pathname: "/", query: { bar: ["baz", "foo"] } }} />;
<Link href={{ pathname: "/", query: { bar: ["baz", "foo"] }, hash: "foo" }} />;

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

// Catch All
<Link href={{ pathname: "/[...slug]", query: { slug: ["baz", "foo"] } }} />;
// @ts-expect-error missing 'slug' in query
<Link href={{ pathname: "/[...slug]", query: { slug: undefined } }} />;

// Change query for current page
<Link href={{ query: { bar: "baz" } }} />;
<Link href={{ query: { foo: "foo" } }} />;
<Link href={{ query: { foo: ["foo", "bar"] } }} />;

// Change hash for current page
<Link href={{ hash: "#foo" }} />;

// Change hash and query for current page
<Link href={{ query: { bar: "baz", hash: "#foo" } }} />;

// Unaugmented props
<Link
  href={{ query: {} }}
  replace
  scroll
  shallow
  passHref
  prefetch
  locale={false}
  legacyBehavior={false}
  onClick={console.log}
  onMouseEnter={console.log}
  children="Link"
/>;
// @ts-expect-error replace typo
<Link href={{ query: {} }} replacey />;
// anchor props https://beta.nextjs.org/docs/api-reference/components/link#props
<Link href={{ query: {} }} className="foo" />;

// LinkProps

// ensure LinkProps is typed (Next.js route types are overriden by nextjs-routes.d.ts)
expectType<LinkProps["href"]>({ pathname: "/" });
// static route
expectType<LinkProps["href"]>("/");
// @ts-expect-error invalid pathname
expectType<LinkProps["href"]>({ pathname: "/invalid" });

// next/router
const router = useRouter();

// pathname

expectType<"/" | "/foos/[foo]" | "/[...slug]">(router.pathname);

// route

expectType<"/" | "/foos/[foo]" | "/[...slug]">(router.route);

// query

expectType<string | string[] | undefined>(router.query.foo);
expectType<string | string[] | undefined>(router.query.bar);
// type narrowing
const router1 = useRouter<"/foos/[foo]">();
expectType<string | undefined>(router1.query.foo);
if (router1.isReady) {
  expectType<string>(router1.query.foo);
}

// push

// Path without dynamic segments
router.push({ pathname: "/" });
router.push({ pathname: "/", query: undefined });
router.push({ pathname: "/", query: {} });
router.push({ pathname: "/", query: { bar: "baz" } });
router.push({ pathname: "/", query: { bar: ["foo", "baz"] } });
router.push({ pathname: "/", query: { bar: ["foo", "baz"] }, hash: "foo" });

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

// Catch All
router.push({ pathname: "/[...slug]", query: { slug: ["baz", "foo"] } });
// @ts-expect-error missing 'slug' in query
router.push({ pathname: "/[...slug]", query: { slug: undefined } });

// Change query for current page
router.push({ query: { bar: "baz" } });
router.push({ query: { foo: "foo" } });
router.push({ query: { foo: ["foo", "bar"] } });

// Change hash for current page
router.push({ hash: "#foo" });

// Change hash and query for current page
router.push({ query: { bar: "baz" }, hash: "#foo" });

// Reassignment
router.push(router);

// Unaugmented options
router.push({}, undefined, { shallow: true, locale: false, scroll: true });
router.push({ query: {} }, undefined, {
  shallow: true,
  locale: false,
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
router.replace({ pathname: "/", query: { bar: ["foo", "baz"] }, hash: "foo" });

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
router.replace({}, undefined, { shallow: true, locale: false, scroll: true });
router.replace({ query: {} }, undefined, {
  shallow: true,
  locale: false,
  scroll: true,
});
// @ts-expect-error shallow typo
router.replace({ query: {} }, undefined, { shallowy: true });

// Reassignment
router.replace(router);
router.replace({ query: router.query });

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

let r: Route;

// Path without dynamic segments
r = { pathname: "/" };
r = { pathname: "/", query: undefined };
r = { pathname: "/", query: {} };
r = { pathname: "/", query: { bar: "baz" } };
r = { pathname: "/", query: { bar: ["foo", "baz"] } };

// Path with dynamic segments
r = { pathname: "/foos/[foo]", query: { foo: "baz" } };
// @ts-expect-error missing 'foo' in query
r = { pathname: "/foos/[foo]", query: { bar: "baz" } };
// @ts-expect-error missing 'foo' in query
r = { pathname: "/foos/[foo]", query: undefined };
// @ts-expect-error missing 'foo' in query
r = { pathname: "/foos/[foo]", query: {} };
r = { pathname: "/foos/[foo]", query: { foo: "baz", bar: "baz" } };
// @ts-expect-error 'foo' must be a string, not string[]
r = { pathname: "/foos/[foo]", query: { foo: ["bar", "baz"] } };

// route
// Path without dynamic segments
route({ pathname: "/" });
// Path with dynamic segments
route({ pathname: "/foos/[foo]", query: { foo: "baz" } });
route({ pathname: "/foos/[foo]", query: { foo: "baz" }, hash: "foo" });
// @ts-expect-error missing 'foo' in query
route({ pathname: "/foos/[foo]", query: { bar: "baz" } });
// @ts-expect-error 'foo' must be a string, not string[]
route({ pathname: "/foos/[foo]", query: { foo: ["bar", "baz"] } });

// RoutedQuery

// Path without dynamic segments
let rq1: RoutedQuery<"/">;
rq1 = {};
rq1 = { foo: "baz" };
rq1 = { foo: ["bar", "baz"] };
rq1 = { foo: undefined };

// Path with dynamic segments
let rq2: RoutedQuery<"/foos/[foo]">;
// @ts-expect-error missing 'foo' in query
rq2 = {};
rq2 = { foo: "bar" };
// @ts-expect-error missing 'foo' in query
rq2 = { bar: "baz" };
// @ts-expect-error 'foo' must be a string, not string[]
rq2 = { foo: ["bar", "baz"] };

let getServerSideProps = (async (
  ctx: GetServerSidePropsContext<"/foos/[foo]">
) => {
  expectType<string>(ctx.params.foo);
  return {
    redirect: {
      destination: route({
        pathname: "/foos/[foo]",
        query: { foo: ctx.params.foo },
      }),
      permanent: false,
    },
  };
}) satisfies GetServerSideProps<{}, "/foos/[foo]">;

expectType<
  (
    ctx: GetServerSidePropsContext<"/foos/[foo]">
  ) => Promise<{ redirect: { destination: string; permanent: boolean } }>
>(getServerSideProps);

getServerSideProps = (async (ctx) => {
  expectType<string>(ctx.params.foo);
  return {
    redirect: {
      destination: route({
        pathname: "/foos/[foo]",
        query: { foo: ctx.params.foo },
      }),
      permanent: false,
    },
  };
}) satisfies GetServerSideProps<{}, "/foos/[foo]">;
