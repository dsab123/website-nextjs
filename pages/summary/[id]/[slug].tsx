import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Head from 'next/head';

type BookSummaryContents = {
    data: string;
};

type BookSummaryInfo = {
    summary_id: number,
    title: string
    author: string,
    link: string,
    teaser: string
    image_uri: string
    is_ready: boolean,
    slug: string,
    quality: number,
    payoff: number
};


async function fetchBookSummaryContents(slug: string): Promise<BookSummaryContents> {
    let response = await fetch(`/api/booksummary-contents/${slug}`);
    if (response.status >= 400) {
        throw new Error("Bad response from server") // todo make this better
    }

    return await response.json() as BookSummaryContents;
}

async function fetchBookSummaryInfo(id: number): Promise<BookSummaryInfo> {
    let response = await fetch(`/api/booksummary-info/${id}`);
    if (response.status >= 400) {
        throw new Error("Bad response from server") // todo make this better
    }

    return await response.json() as BookSummaryInfo;
}

export default function Summary() {
    const [summaryContents, setSummaryContents] = useState<BookSummaryContents>(null);
    const [summaryInfo, setSummaryInfo] = useState<BookSummaryInfo>(null);
    const [error, setError] = useState('');
    const router = useRouter();
    
    useEffect(() => { 
        let isSubscribed = true;    

        const slug = router.query['slug'] as string;
        const id = parseInt(router.query['id'] as string);

        if (typeof slug !== 'undefined') {
            fetchBookSummaryContents(slug)
                .then(summaryContents => (isSubscribed ? setSummaryContents(summaryContents) : null))
                .catch(error => (isSubscribed ? setError(error.toString()) : null));    
        }
        
        // this information could be available from summaries page; find out how to pass it to this component
        if (!isNaN(id)) {
            fetchBookSummaryInfo(id)
                .then(summaryInfo => (isSubscribed ? setSummaryInfo(summaryInfo) : null))
                .catch(error => (isSubscribed ? setError(error.toString()) : null));
        }

        return () => (isSubscribed = false);
    }, [router]);
        
    return <>
        <Head>
            {summaryInfo && <meta property="og:title" content={`${summaryInfo.title} | Daniel Sabbagh`} key="title" />}
            {summaryInfo && <meta property="og:description" content={`${summaryInfo.teaser}`} key="description" />}
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/silver.jpg" key="image" />
        </Head>
            <Header></Header>
            <p>Header is up here?</p>
            <br />
            {summaryInfo && <h1>Summary - {summaryInfo.title}</h1>}
            {summaryInfo && <h2>by {summaryInfo.author}</h2>}
            {summaryInfo && <img src={summaryInfo.image_uri}></img>}
            {!error && !summaryContents && <p>Loading review...</p>}
            {summaryContents && <p>{summaryContents.data}</p>}
            <Footer></Footer>
        </>
}