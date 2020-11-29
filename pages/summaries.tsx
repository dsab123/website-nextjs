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
    const [summaries, setSummaries] = useState<BookSummaryLookupItem[]>([
        {summary_id: 1, title: '', author: '', link: '', teaser: '', image_uri: '',
            is_ready: true, slug: '', quality: 4, payoff: 4},
        {summary_id: 2, title: '', author: '', link: '', teaser: '', image_uri: '',
            is_ready: true, slug: '', quality: 4, payoff: 4},
        {summary_id: 3, title: '', author: '', link: '', teaser: '', image_uri: '',
            is_ready: true, slug: '', quality: 4, payoff: 4},
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const intro = "I like to read pretty widely, from tech to theology to bestsellers. Below you'll find a review for each of the books I've read, along with a link to buy. Drop me a line if you purchase any of these!";
    const disclaimer = "I'm a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.";

    useEffect(() => { 
        fetchBookSummaryLookup()
            .then(summaries => {
                    setSummaries(summaries);
                    setIsLoading(false);
            })
            .catch(error => (isLoading ? setError(error.toString()) : null));
    }, []);
    
    return <>
        <Head>
            <title key="main-title">Book Summaries | Daniel Sabbagh</title>
            <meta property="og:title" content="Recent Book Summaries | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="Book Summaries to help you read better" key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/favicon.ico" key="image" />
        </Head>
        
        <div className={styles.outer}>
            <h2 className={styles.pageTitle}>Featured Book Summaries</h2>

            <div className={isLoading ? styles.dimOverlay : ''}>
                <p className={styles.introText}>{intro}</p>
                <br />
                {summaries.map((summary) => (
                    <div key={summary.summary_id} className={styles.card}>
                        <div className={isLoading ? styles.loadingBookImage : ''}>
                            {!isLoading && 
                            <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summary_id}/${summary.slug}`}>
                                <img className={styles.bookImage} src={summary.image_uri} />
                            </Link>}
                        </div>
                        <div className={styles.cardText}>
                            <div className={isLoading ? styles.loadingBookText : ''}>
                            {/* <div className={styles.loadingBookText}> */}
                                <p className={styles.bookTitle}>{summary.title}</p>
                            </div>
                            <div className={isLoading ? styles.loadingBookText : ''}>
                            {/* <div className={styles.loadingBookText}> */}
                                <p className={styles.bookAuthor}>{summary.author}</p>
                            </div>
                            <div className={isLoading ? styles.loadingBookText : ''}>
                            {/* <div className={styles.loadingBookText}> */}
                                <p className={styles.bookTeaser}>{summary.teaser}</p>
                            </div>
                            <div className={styles.summaryDetail}>
                                <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summary_id}/${summary.slug}`}>
                                    <a className={summary.is_ready ? styles.readMore : styles.hidden}>
                                        read review
                                    </a>
                                </Link>
                                <p className={summary.is_ready ? styles.hidden : styles.comingSoon}>
                                    review coming soon
                                </p>
                                <a className={isLoading ? `${styles.amazonLink} ${styles.inactiveLink}` : styles.amazonLink} href={isLoading ? '' : summary.link} target="_blank">buy from amazon</a>
                            </div>
                        </div>
                    </div>
                ))}

                {!isLoading && <p className={styles.disclaimerText}>{disclaimer}</p>}
                <br />
            </div>
        </div>
    </>
}