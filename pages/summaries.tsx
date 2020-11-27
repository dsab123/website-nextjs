import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Summaries.module.css';

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

export default function Summaries() {
    const [summaries, setSummaries] = useState<BookSummaryLookupItem[]>([]);
    const [error, setError] = useState('');
    
    const intro = "I like to read pretty widely, from tech to theology to bestsellers. Below you'll find a review for each of the books I've read, along with a link to buy. Drop me a line if you purchase any of these!";
    const disclaimer = "I'm a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.";

    useEffect(() => { 
        let isSubscribed = true;
        fetchBookSummaryLookup()
            .then(summaries => (isSubscribed ? setSummaries(summaries) : null))
            .catch(error => (isSubscribed ? setError(error.toString()) : null));
        return () => (isSubscribed = false);
    }, []);
    
    return <>
        <Head>
            <title key="main-title">Book Summaries | Daniel Sabbagh</title>
            <meta property="og:title" content="Recent Book Summaries | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="Cool Sweet Book Summaries aww yiss" key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/favicon.ico" key="image" />
        </Head>
        
        <div className={styles.outer}>
            <h2 className={styles.pageTitle}>Featured Book Summaries</h2>

            <p className={styles.introText}>{intro}</p>
            <br />
            <p className={styles.disclaimerText}>{disclaimer}</p>
            <br />
            {summaries.map((summary) => (
                <div key={summary.summary_id} className={styles.card}>
                    <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summary_id}/${summary.slug}`}>
                        <img className={styles.bookImage} src={summary.image_uri} />
                    </Link>
                    <div className={styles.cardText}>
                        <div>
                            <p className={styles.bookTitle}>{summary.title}</p>
                            <p className={styles.bookAuthor}>{summary.author}</p>
                        </div>
                        <p className={styles.bookSummary}>{summary.teaser}</p>
                        <div className={styles.summaryDetail}>
                            <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summary_id}/${summary.slug}`}>
                                <a className={summary.is_ready ? styles.readMore : styles.hidden}>
                                    read review
                                </a>
                            </Link>
                            <p className={summary.is_ready ? styles.hidden : styles.comingSoon}>
                                review coming soon
                            </p>
                            <a className={styles.amazonLink} href={summary.link} target="_blank">buy from amazon</a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </>
}