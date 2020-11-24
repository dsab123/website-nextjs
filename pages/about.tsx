import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {

    return <>
        <Head>
            <meta property="og:title" content="About Me | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="I like things sometimes" key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/favicon.ico" key="image" />
        </Head>
        <Header></Header>
        <h3>This will be the about page</h3>
        <Footer></Footer>
    </>
}