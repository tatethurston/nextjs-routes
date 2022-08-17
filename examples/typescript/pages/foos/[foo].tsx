import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { route } from "nextjs-routes";

const Foo: NextPage = () => {
  const router = useRouter<"/foos/[foo]">();
  const { foo } = router.query;
  return <div>Foo: {foo}</div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: route({ pathname: "/bars/[bar]", query: { bar: "foo" } }),
      permanent: false,
    },
  };
};

export default Foo;
