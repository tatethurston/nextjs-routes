import { NextPage } from "next";
import { useRouter } from "nextjs-routes/router";

const Bar: NextPage = () => {
  const router = useRouter<"/bars/[bar]">();
  const { bar } = router.query;
  return <div>Bar: {bar}</div>;
};

export default Bar;
