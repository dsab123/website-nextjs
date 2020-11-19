import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Head from 'next/head';
import React from 'react';

export default function Blog() {
    return <>
        <Head>
            <meta property="og:title" content="Blog Post | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="This is a really cool blog post" key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/silver.jpg" key="image" />
        </Head>
            <Header></Header>
            <p>Header is up here?</p>
            <h1>Blog will go here:</h1>
            <Footer></Footer>
        </>
}