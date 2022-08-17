interface Route {
  pathname: string;
  query?: { [key: string]: string | string[] | undefined };
}

interface OptionalCatchAll extends Route {
  query?: { [key: string]: string[] | undefined };
}

interface CatchAll extends Route {
  query: { [key: string]: string[] };
}

interface Dynamic extends Route {
  query: { [key: string]: string };
}

export function route(r: Route): string {
  const params = new Set<string>();
  const path =
    "/" +
    r.pathname
      .split("/")
      .map((segment) => {
        // optional catch all
        if (segment.startsWith("[[...") && segment.endsWith("]]")) {
          const query = segment.slice(5, -2);
          params.add(query);
          return (r as OptionalCatchAll).query?.[query]?.join("/");
        }
        // catch all
        if (segment.startsWith("[...") && segment.endsWith("]")) {
          const query = segment.slice(4, -1);
          params.add(query);
          return (r as CatchAll).query[query].join("/");
        }
        // dynamic
        if (segment.startsWith("[") && segment.endsWith("]")) {
          const query = segment.slice(1, -1);
          params.add(query);
          return (r as Dynamic).query[query];
        }
        return segment;
      })
      // removes optional catch all if no query is supplied
      .filter(Boolean)
      .join("/");

  const search = new URLSearchParams();
  for (const key in r.query) {
    if (!params.has(key)) {
      const value = r.query[key];
      if (Array.isArray(value)) {
        value.forEach((val) => search.append(key, val));
      } else {
        search.append(key, value as string);
      }
    }
  }
  const qs = search.toString().length > 0 ? "?" + search.toString() : "";

  return path + qs;
}
