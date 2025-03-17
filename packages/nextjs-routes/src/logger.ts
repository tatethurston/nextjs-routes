export const logger: Pick<Console, "error" | "info"> = {
  error: (str: string) => console.error("[nextjs-routes] " + str),
  info: (str: string) => console.info("[nextjs-routes] " + str),
};
