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
    const [contents, setContents] = useState<BookSummaryContents>(null);
    const [info, setInfo] = useState<BookSummaryInfo>(null);
    const [error, setError] = useState('');
    const router = useRouter();
    
    useEffect(() => { 
        let isSubscribed = true;    

        const slug = router.query['slug'] as string;
        const id = parseInt(router.query['id'] as string);

        if (typeof slug !== 'undefined') {
            fetchBookSummaryContents(slug)
                .then(summaryContents => (isSubscribed ? setContents(summaryContents) : null))
                .catch(error => (isSubscribed ? setError(error.toString()) : null));    
        }
        
        // this information could be available from summaries page; find out how to pass it to this component
        if (!isNaN(id)) {
            fetchBookSummaryInfo(id)
                .then(summaryInfo => (isSubscribed ? setInfo(summaryInfo) : null))
                .catch(error => (isSubscribed ? setError(error.toString()) : null));
        }

        return () => (isSubscribed = false);
    }, [router]);
        
    return <>
        <Head>
            <meta property="og:title" content="Book Summary | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="This is a really cool Book Summary" key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/silver.jpg" key="image" />
        </Head>
            <Header></Header>
            <p>Header is up here?</p>
            <br />
            {info && <h1>Summary - {info.title}</h1>}
            {info && <h2>by {info.author}</h2>}
            {info && <img src={info.image_uri}></img>}
            {!error && !contents && <p>Loading review...</p>}
            {contents && <p>{contents.data}</p>}
            <Footer></Footer>
        </>
}