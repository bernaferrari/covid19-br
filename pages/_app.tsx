import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useMemo } from "react";
import { generateDefaultSeo } from "next-seo/pages";
import theme from "../theme";
import seo from "../seo.config";

const App = ({ Component, pageProps }: AppProps) => {
  const defaultSeoTags = useMemo(() => generateDefaultSeo(seo), []);

  return (
    <ChakraProvider value={theme}>
      <Head>
        {defaultSeoTags}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="1024x1024" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default App;
