"use client";

// 'use client' marks this page as a Client Component
// https://beta.nextjs.org/docs/rendering/server-and-client-components

import { useRouter } from "next/navigation";

export default function Client() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push("/tate")}>
      Dashboard
    </button>
  );
}
