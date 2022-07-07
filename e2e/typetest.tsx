import Link from "next/link";
import { useRouter } from "next/router";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
function expectType<T>(_value: T) {}

// next/link

// Path without dynamic segments
<Link href={{ pathname: "/" }} />;
<Link href={{ pathname: "/", query: undefined }} />;
<Link href={{ pathname: "/", query: {} }} />;
<Link href={{ pathname: "/", query: { bar: "baz" } }} />;

// Path with dynamic segments
<Link href={{ pathname: "/foos/[foo]", query: { foo: "baz" } }} />;
// @ts-expect-error missing 'foo' in query
<Link href={{ pathname: "/foos/[foo]", query: { bar: "baz" } }} />;
// @ts-expect-error missing 'foo' in query
<Link href={{ pathname: "/foos/[foo]", query: undefined }} />;
// @ts-expect-error missing 'foo' in query
<Link href={{ pathname: "/foos/[foo]", query: {} }} />;
<Link href={{ pathname: "/foos/[foo]", query: { foo: "baz", bar: "baz" } }} />;

// Only change query for current page
<Link href={{ query: { bar: "baz" } }} />;
<Link href={{ query: { foo: "foo" } }} />;

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

// next/router
const router = useRouter();

// pathname
expectType<"/" | "/foos/[foo]">(router.pathname);

// route
expectType<"/" | "/foos/[foo]">(router.route);

// query
expectType<{ foo: string; [key: string]: string } | { [key: string]: string }>(
  router.query
);

// push

// Path without dynamic segments
router.push({ pathname: "/" });
router.push({ pathname: "/", query: undefined });
router.push({ pathname: "/", query: {} });
router.push({ pathname: "/", query: { bar: "baz" } });

// Path with dynamic segments
router.push({ pathname: "/foos/[foo]", query: { foo: "baz" } });
// @ts-expect-error missing 'foo' in query
router.push({ pathname: "/foos/[foo]", query: { bar: "baz" } });
// @ts-expect-error missing 'foo' in query
router.push({ pathname: "/foos/[foo]", query: undefined });
// @ts-expect-error missing 'foo' in query
router.push({ pathname: "/foos/[foo]", query: {} });
router.push({ pathname: "/foos/[foo]", query: { foo: "baz", bar: "baz" } });

// Only change query for current page
router.push({ query: { bar: "baz" } });
router.push({ query: { foo: "foo" } });

// Unaugmented options
router.push({}, undefined, { shallow: true, locale: "en", scroll: true });
// @ts-expect-error shallow typo
router.push({}, undefined, { shallowy: true });

// replace

// Path without dynamic segments
router.replace({ pathname: "/" });
router.replace({ pathname: "/", query: undefined });
router.replace({ pathname: "/", query: {} });
router.replace({ pathname: "/", query: { bar: "baz" } });

// Path with dynamic segments
router.replace({ pathname: "/foos/[foo]", query: { foo: "baz" } });
// @ts-expect-error missing 'foo' in query
router.replace({ pathname: "/foos/[foo]", query: { bar: "baz" } });
// @ts-expect-error missing 'foo' in query
router.replace({ pathname: "/foos/[foo]", query: undefined });
// @ts-expect-error missing 'foo' in query
router.replace({ pathname: "/foos/[foo]", query: {} });
router.replace({ pathname: "/foos/[foo]", query: { foo: "baz", bar: "baz" } });

// Only change query for current page
router.replace({ query: { bar: "baz" } });
router.replace({ query: { foo: "foo" } });

// Unaugmented options
router.replace({}, undefined, { shallow: true, locale: "en", scroll: true });
// @ts-expect-error shallow typo
router.replace({}, undefined, { shallowy: true });
