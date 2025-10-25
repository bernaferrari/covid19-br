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
      <Head>{defaultSeoTags}</Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default App;
