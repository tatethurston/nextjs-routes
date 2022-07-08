import { NextPage } from "next";
import { useRouter } from "next/router";

const Bar: NextPage = () => {
  const router = useRouter<"/bars/[bar]">();
  const { bar } = router.query;
  return <div>Bar: {bar}</div>;
};

export default Bar;
