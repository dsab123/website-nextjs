import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return <>
      <Head>
        <title key="main-title">Daniel Sabbagh | Reading Is Essential</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2 className={styles.title}>Coming soon!</h2>
      <p className={styles.teaser}>Until then, go look at my <Link href="/summaries"><a>book summaries</a></Link> or <Link href="/blogs"><a>blog posts</a></Link>!</p>
  </>;
}