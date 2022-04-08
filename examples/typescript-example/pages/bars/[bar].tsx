import { NextPage } from "next";
import { useRouter } from "nextjs-routes/router";

const Foo: NextPage = () => {
  const router = useRouter();
  const { bar } = router.query;
  return <div>Foo: {bar}</div>;
};

export default Foo;
