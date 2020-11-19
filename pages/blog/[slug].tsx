import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Head from 'next/head';
import React from 'react';

export default function Blog() {
    const [origin, setOrigin] = React.useState("");

    React.useEffect(() => {
      setOrigin(window.location.origin); // <-- here I get access to window
    }, []);

    return <>
        <Head>
            <meta property="og:title" content="Blog Post | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="This is a really cool blog post" key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content={`${origin}/silver.jpg`} key="image" />
        </Head>
            <Header></Header>
            <p>Header is up here?</p>
            <h1>Blogs will go here:</h1>
            <Footer></Footer>
        </>
}