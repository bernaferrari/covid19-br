import type { AppProps } from "next/app";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import { useMemo } from "react";
import { generateDefaultSeo } from "next-seo/pages";
import { cn } from "@/lib/utils";
import seo from "../seo.config";
import "../styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const App = ({ Component, pageProps }: AppProps) => {
  const defaultSeoTags = useMemo(() => generateDefaultSeo(seo), []);

  return (
    <div className={cn("font-sans antialiased", geist.variable, geistMono.variable)}>
      <Head>
        {defaultSeoTags}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="1024x1024" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
};

export default App;
