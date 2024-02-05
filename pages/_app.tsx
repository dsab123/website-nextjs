import { useEffect } from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from 'next/head'
import Footer from '../components/Footer';
import * as gtag from "../lib/gtag";
import '../styles/globals.css'
import dynamic from "next/dynamic";
import { Analytics } from '@vercel/analytics/react';


const Header = dynamic(() => import("../components/Header"), {
  ssr: false,
});

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  
  return (
    <>
    <Head>
      <meta charSet="utf-8" /> 
      <title key="original-title">Daniel Sabbagh | Reading Is Essential</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
      <meta property="og:title" content="Daniel Sabbagh" key="title" />
      <meta property="og:description" content="Reading is Essential - This Blog will help you read more." key="description" />
      <meta property="og:type" content="article" key="type" />
      <meta property="og:image" content={`https://danielsabbagh.com/static/mobile-logo-large.jpg`} key="image" />
      
      <link rel="manifest" href="/manifest.json" />
      <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
      
      <link rel="preconnect stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Text&family=Libre+Caslon+Text&display=swap" />
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-69638158-1"></script>
    </Head>

    <div className="topBar"></div>
    
    <div className="content" id="content">
      <Header></Header>
      <Component {...pageProps} />
      <Footer></Footer>
      <Analytics />
    </div>
    </>
  )
}

export default App