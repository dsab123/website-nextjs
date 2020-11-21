import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react';

type BookSummaryLookupItem = {
    summary_id: number,
    title: string,
    author: string,
    link: string,
    teaser: string,
    image_uri: string,
    is_ready: boolean,
    slug: string,
    quality: number,
    payoff: number
};


async function fetchBookSummaryLookup(): Promise<BookSummaryLookupItem[]> {
    let response = await fetch('/api/booksummary-lookup');

    if (response.status >= 400) {
        throw new Error("Bad response from server")
    }

    return await response.json() as BookSummaryLookupItem[];
}

export default function Summarues() {
    const [summaries, setSummaries] = useState<BookSummaryLookupItem[]>([]);
    const [error, setError] = useState('');
    
    useEffect(() => { 
        let isSubscribed = true;
        fetchBookSummaryLookup()
            .then(summaries => (isSubscribed ? setSummaries(summaries) : null))
            .catch(error => (isSubscribed ? setError(error.toString()) : null));
        return () => (isSubscribed = false);
    }, []);
    
    return <>
        <Head>
            <meta property="og:title" content="Recent Book Summaries | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="Cool Sweet Book Summaries aww yiss" key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/favicon.ico" key="image" />
        </Head>
        <ul>
            {summaries.length == 0 && <p className="loading">loading...</p>}
            {summaries.map((summary) => (
                <li key={summary.summary_id}>
                <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summary_id}/${summary.slug}`}>
                    <a>{summary.title}</a>
                </Link>
            </li>
            ))}
        </ul>
    </>
}