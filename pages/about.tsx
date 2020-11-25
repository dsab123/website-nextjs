import Head from 'next/head'

export default function About() {

    return <>
        <Head>
            <meta property="og:title" content="About Me | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="I like things sometimes" key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/favicon.ico" key="image" />
        </Head>
        <h3>This will be the about page</h3>
    </>
}