import Link from "next/link";
import { readdir } from "node:fs/promises";
import Client from "./client";

export default async function Page() {
  const files = await readdir("..");
  return (
    <div>
      <Client />
      <Link href="/">Home</Link>
      {files.map((f) => (
        <p key={f}>{f}</p>
      ))}
    </div>
  );
}
