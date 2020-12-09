import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Summaries.module.css';

type BookSummaryInfo = {
    summaryId: number,
    title: string,
    author: string,
    link: string,
    teaser: string,
    imageUri: string,
    isReady: boolean,
    slug: string,
    quality: number,
    payoff: number
};

async function fetchBookSummaryLookup(): Promise<BookSummaryInfo[]> {
    let response = await fetch('/api/booksummary-lookup');

    if (response.status >= 400) {
        throw new Error("Bad response from server")
    }

    return await response.json() as BookSummaryInfo[];
}

export default function Summaries() {
    const [summaries, setSummaries] = useState<BookSummaryInfo[]>([
        {summaryId: 1, title: '', author: '', link: '', teaser: '', imageUri: '',
            isReady: true, slug: '', quality: 4, payoff: 4},
        {summaryId: 2, title: '', author: '', link: '', teaser: '', imageUri: '',
            isReady: true, slug: '', quality: 4, payoff: 4},
        {summaryId: 3, title: '', author: '', link: '', teaser: '', imageUri: '',
            isReady: true, slug: '', quality: 4, payoff: 4},
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
            <title key="original-title">Book Summaries to Help You Read Better | Daniel Sabbagh</title>
            <meta property="og:title" content="Book Summaries to Help You Read Better | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="Book Summaries to help you read more." key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/static/mobile-logo.jpg" key="image" />
        </Head>
        
        <div className={styles.outer}>
            <h1 className={styles.pageTitle}>Featured Book Summaries</h1>

            <div className={isLoading ? styles.dimOverlay : ''}>
                <p className={styles.introText}>{intro}</p>
                <br />
                {summaries.map((summary) => (
                    <div key={summary.summaryId} className={styles.card}>
                        <div className={isLoading ? styles.loadingBookImage : ''}>
                            {!isLoading && 
                            <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summaryId}/${summary.slug}`}>
                                <img className={summary.isReady ? styles.bookImage : styles.nonAnimatedBookImage} src={summary.imageUri} />
                            </Link>}
                        </div>
                        <div className={styles.cardText}>
                            <div className={isLoading ? styles.loadingBookText : ''}>
                                <p className={styles.bookTitle}>{summary.title}</p>
                            </div>
                            <div className={isLoading ? styles.loadingBookText : ''}>
                                <p className={styles.bookAuthor}>{summary.author}</p>
                            </div>
                            <div className={isLoading ? styles.loadingBookText : ''}>
                                <p className={styles.bookTeaser}>{summary.teaser}</p>
                            </div>
                            <div className={styles.summaryDetail}>
                                <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summaryId}/${summary.slug}`}>
                                    <a className={summary.isReady ? styles.readMore : styles.hidden}>
                                        read review
                                    </a>
                                </Link>
                                <p className={summary.isReady ? styles.hidden : styles.comingSoon}>
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