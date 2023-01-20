import type { AppProps } from "next/app";
import withRoutes from "nextjs-routes/config";
withRoutes({});

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
