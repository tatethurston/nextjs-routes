import type { NextPage, GetStaticProps } from "next";
import type { RoutedQuery } from "nextjs-routes";

type BarPageProps = { bar: string };

export const getStaticProps: GetStaticProps<
  BarPageProps,
  RoutedQuery<"/bars/[bar]">
> = (context) => {
  const { bar } = context.params!;

  return {
    props: { bar },
  };
};

const Bar: NextPage<BarPageProps> = ({ bar }) => {
  return <div>Bar: {bar}</div>;
};

export default Bar;
