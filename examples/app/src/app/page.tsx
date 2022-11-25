import Link from "next/link";
import Client from "./client";

export default function Page() {
  return (
    <>
      <Client />
      <Link href={{ pathname: "/[store]", query: { store: "tate" } }}>
        Tate's Store
      </Link>
    </>
  );
}
