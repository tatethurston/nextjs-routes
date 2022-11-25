"use client";

import { useSearchParams } from "next/navigation";

export default function Client() {
  const searchParams = useSearchParams();
  const version = searchParams.get("v");
  const store = searchParams.get("store");

  return (
    <div>
      <p>Version: {version}</p>
      <p>Store: {store}</p>
    </div>
  );
}
