import Head from 'next/head'
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <>
    <Head>
      <meta charSet="utf-8" /> 
      <title>Daniel Sabbagh</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
      <meta property="og:title" content="Daniel Sabbagh's Blog" key="title" />
      <meta property="og:description" content="Blog, Book Reviews, Giveaways, and more!" key="description" />
      <meta property="og:type" content="article" key="type" />
      <meta property="og:image" content="/large-logo.jpg" key="image" />
      
      <link rel="manifest" href="/manifest.json" />
      <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
      
      <link rel="preconnect stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Text&family=Libre+Caslon+Text&display=swap" crossOrigin />
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-69638158-1"></script>
    </Head>
    <Component {...pageProps} />
    </>
  )
}

export default App