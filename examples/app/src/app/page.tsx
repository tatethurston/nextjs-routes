import Link from "next/link";
import Client from "./client";
import { route } from "nextjs-routes";

export default function Page() {
  return (
    <>
      <Client />
      <Link href="/">Home</Link>
      <Link href={route({ pathname: "/[store]", query: { store: "tate" } })}>
        Tate's Store
      </Link>
    </>
  );
}
