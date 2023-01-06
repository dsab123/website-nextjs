import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import BookHover from '../components/BookHover';
import Disclaimer from '../components/Disclaimer';
import styles from '../styles/Summaries.module.css';

async function fetchBookSummaryLookup(): Promise<BookSummaryInfo[]> {
    let response = await fetch('/api/booksummary-lookup');

    if (response.status >= 400) {
        throw new Error("Bad response from server")
    }

    return await response.json() as BookSummaryInfo[];
}

export default function Summaries() {
    const [summaries, setSummaries] = useState<BookSummaryInfo[]>([
        {summaryId: 1, title: '', author: '', link: '', teaser: '', imageUri: '', ogImageUri: '',
            isReady: true, slug: '', quality: 4, payoff: 4},
        {summaryId: 2, title: '', author: '', link: '', teaser: '', imageUri: '', ogImageUri: '',
            isReady: true, slug: '', quality: 4, payoff: 4},
        {summaryId: 3, title: '', author: '', link: '', teaser: '', imageUri: '', ogImageUri: '',
            isReady: true, slug: '', quality: 4, payoff: 4},
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const intro = "Here is a running list of books I've read that have helped me to become a better reader, thinker and Christian. Let me know if you buy any of these!";

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
            <meta property="og:image" content={`https://danielsabbagh.com/static/mobile-logo-large.jpg`} key="image" />

            <meta name="twitter:title" content="Book Summaries to Help You Read Better | Daniel Sabbagh" key="twitter-title" />
            <meta name="twitter:description" content="Book Summaries to help you read more." key="twitter-description" />
            <meta name="twitter:image" content={`https://danielsabbagh.com/static/mobile-logo-large.jpg`} key="twitter-image" />
            <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
            <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />
            <meta name="twitter:site" content="@_danielsabbagh" key="twitter-site" />
        </Head>
        
        <div className={styles.outer}>
            <h1 className={styles.pageTitle}>Featured Book Summaries</h1>

            <div className={isLoading ? styles.dimOverlay : ''}>
                <p className={styles.introText}>{intro}</p>
                <br />
                {summaries.map((summary) => (
                    <div key={summary.summaryId} className={styles.card}>
                        <div className={isLoading ? styles.loadingBookImage : ''}>
                            {summary.isReady && 
                            <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summaryId}/${summary.slug}`}>
                                <a>
                                    <BookHover imageUri={'/' + summary.imageUri} />
                                </a>
                            </Link>}
                            {!summary.isReady &&
                            <div>
                                <img className={!isLoading ? styles.nonAnimatedBookImage : styles.hidden} src={summary.imageUri} />
                            </div>}
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

                <br />
                <Disclaimer />
            </div>
        </div>
    </>
}