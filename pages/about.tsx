import Head from 'next/head'
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function About() {

    return <>
        <Head>
            <title key="original-title">Why? | Daniel Sabbagh</title>
            <meta property="og:title" content="Why? | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="My goal is to help you read more this year." key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content={`https://danielsabbagh.com/static/mobile-logo-large.jpg`} key="image" />
        </Head>
        
        <h1 className={styles.title}>Coming soon!</h1>
        <p className={styles.teaser}>Until then, go look at my <Link href="/summaries"><a>book summaries</a></Link> or <Link href="/blogs"><a>blog posts</a></Link>!</p>
    </>
}