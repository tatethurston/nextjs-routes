import { NextPage } from "next";
import { useRouter } from "next/router";

const Foo: NextPage = () => {
  const router = useRouter();
  const { foo } = router.query;
  return <div>Foo: {foo}</div>;
};

export default Foo;
