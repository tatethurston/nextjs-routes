import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  route,
  type GetServerSidePropsContext,
  type GetServerSideProps,
} from "nextjs-routes";

const Foo: NextPage = () => {
  const router = useRouter<"/foos/[foo]">();
  const { foo } = router.query;
  return <div>Foo: {foo}</div>;
};

export const getServerSideProps = (async (
  ctx: GetServerSidePropsContext<"/foos/[foo]">
) => {
  return {
    redirect: {
      destination: route({
        pathname: "/bars/[bar]",
        query: { bar: ctx.params.foo },
      }),
      permanent: false,
    },
  };
}) satisfies GetServerSideProps<{}, "/foos/[foo]">;

export default Foo;
