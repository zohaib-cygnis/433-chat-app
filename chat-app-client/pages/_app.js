import { SessionProvider } from "next-auth/react";
import "semantic-ui-css/semantic.min.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
