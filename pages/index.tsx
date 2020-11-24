import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header></Header>
      <h3>Welcome to my blog </h3>
      
      <Footer></Footer>    
    </div>
  )
}
