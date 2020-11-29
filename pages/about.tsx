import Head from 'next/head'
import styles from '../styles/Home.module.css';

export default function About() {

    return <>
        <Head>
            <meta property="og:title" content="About Me | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="My goal is to help you read more books this year." key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/favicon.ico" key="image" />
        </Head>
        <h2 className={styles.title}>Coming Soon!</h2>
    </>
}