import Head from 'next/head'
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <>
    <Head>
      <meta charSet="utf-8" /> 
      <title>Daniel Sabbagh</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
      <meta property="og:title" content="Daniel Sabbagh's Blog" key="title" />
      <meta property="og:description" content="Reading is Essential - This Blog will help you read more." key="description" />
      <meta property="og:type" content="article" key="type" />
      <meta property="og:image" content="https://website-nextjs-nine.vercel.app/large-logo.png" key="image" />
      
      <link rel="manifest" href="/manifest.json" />
      <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
      
      <link rel="preconnect stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Text&family=Libre+Caslon+Text&display=swap" />
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-69638158-1"></script>
    </Head>


    <div className="content" id="content">
        <div className="topBar"></div>
        <div className="stickyHeader">
          <Header></Header>
        </div>
        <Component {...pageProps} />
        <Footer></Footer>        
      </div>
    </>
  )
}

export default App