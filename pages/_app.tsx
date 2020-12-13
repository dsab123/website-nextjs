import Head from 'next/head'
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css'

function App({ Component, pageProps }) {
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