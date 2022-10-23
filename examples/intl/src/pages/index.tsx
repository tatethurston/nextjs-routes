import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { locale } = useRouter();
  console.log({ locale });
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Link href={{ pathname: "/store" }}>Store</Link>
      </main>
    </>
  );
};

export default Home;