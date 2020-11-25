import { useState } from 'react';
import Head from 'next/head';
import { GetStaticPropsContext } from 'next';
import styles from '../../../styles/Summary.module.css';

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

export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        const summaryInfo = await fetchServerSideBookSummaryInfo(context);

        return {
            props: { id: context.params.id, slug: context.params.slug, summaryInfo: JSON.stringify(summaryInfo) }
        }
    } catch (error) {
        return { notFound: true }
    }
}

export async function getStaticPaths() {
    const raw = await fetch(`${process.env.HOST}/api/booksummary-lookup/`);
    const summaryInfos = await raw.json();
    
    return {
        paths: summaryInfos.map((summaryInfo) => {
            return {
                params: { id: `${summaryInfo.summary_id}`, slug: summaryInfo.slug, summaryInfo: JSON.stringify(summaryInfo) }
            }
        }),
        fallback: true
    };
  }


async function fetchServerSideBookSummaryInfo(context: GetStaticPropsContext) {
    const response = await fetch(`${process.env.HOST}/api/booksummary-info/${context.params.id}`);
    if (response.status >= 400) {
        throw new Error("Bad response from server") // todo make this better
    }

    return await response.json();
}

async function fetchBookSummaryContents(slug: string): Promise<BookSummaryContents> {
    let response = await fetch(`/api/booksummary-contents/${slug}`);
    if (response.status >= 400) {
        throw new Error("Bad response from server") // todo make this better
    }

    return await response.json() as BookSummaryContents;
}

function getPayoffRanking(payoff: number) {
    return Array(payoff).fill('👍');
}

function getQualityRanking(payoff: number) {
    return Array(payoff).fill('⭐');
}


export default function Summary(props) {
    const [summaryContents, setSummaryContents] = useState<BookSummaryContents>(null);
    const [error, setError] = useState('');
    
    const summaryInfo = props.summaryInfo && JSON.parse(props.summaryInfo) as BookSummaryInfo;

    if (props.slug) {
        fetchBookSummaryContents(props.slug)
            .then(summaryContents => setSummaryContents(summaryContents))
            .catch(error => setError(error.toString()));
    }

    return <>
        <Head>
            <meta property="og:title" content={`${summaryInfo && summaryInfo.title} | Daniel Sabbagh`} key="title" />
            <meta property="og:description" content={summaryInfo && summaryInfo.teaser} key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content={`${process.env.HOST}/silver.jpg`} key="image" />
        </Head>
            <div className={!error && !summaryContents ? `${styles.dimOverlay} ${styles.outer}` : styles.outer}>
                
                <p className={styles.summaryBookTitle}>{summaryInfo.title}</p>
                <p className={styles.author}>{summaryInfo.author}</p>

                <div className={styles.metrics}>
                    <div className={styles.metricsTitles}>
                        <p className={styles.qualityTitle}>Quality </p>
                        <p className={styles.payoffTitle}>Payoff </p>
                    </div>
                    <div className={styles.metricsMeasures}>
                        <p className={styles.qualityMeasure}>{getQualityRanking(summaryInfo.quality)}</p>
                        <p className={styles.payoffMeasure}>{getPayoffRanking(summaryInfo.payoff)}</p>
                    </div>
                </div>
                <br />

                <div className={styles.inner}>
                    <img className={styles.summaryBookImage} src={`/${summaryInfo.image_uri}`} /> 
                    <div className={styles.teaserAndButton}>
                        <p className={styles.teaser}>{summaryInfo.teaser}</p>
                        <a href="${link}" target="_blank"><img className={styles.buyButton} src="/amazon-button.png" /> </a>
                    </div>
                </div>

                <br />
                <p className={styles.review}>Review</p>
                <br />

                <p className={!error && !summaryContents ? `${styles.dimOverlay} ${styles.summaryContents}` : styles.summaryContents}>
                    {!error && !summaryContents && <p>Loading review...</p>}
                    {summaryContents && summaryContents.data}
                </p>

                <br />
                <p className={styles.summaryContents}>You can get yourself a copy of the book <a href={summaryInfo.link} target="_blank">here</a>.</p>
                <br />
                <br />
            </div>
        </>
}