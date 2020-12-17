import { useEffect, useState } from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import remark from 'remark'
import html from 'remark-html'
import summary from '../../../data/summary.json';
import styles from '../../../styles/Summary.module.css';

async function markdownToHtml(markdown: string) {
    const result = await remark().use(html).process(markdown)
    return result.toString()
}

type BookSummaryContents = {
    data: string;
};

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

export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        const summaryInfo = await fetchServerSideBookSummaryInfo(context);

        return {
            props: { 
                id: context.params.id, 
                slug: context.params.slug, 
                title: summaryInfo.title, 
                teaser: summaryInfo.teaser, 
                imageUri: summaryInfo.imageUri,
                summaryInfo: JSON.stringify(summaryInfo) }
        }
    } catch (error) {
        return { notFound: true }
    }
}

export async function getStaticPaths() {
    const summaryInfos = summary.summaries;

    return {
        paths: summaryInfos.map((summaryInfo) => {
            return {
                params: { 
                    id: `${summaryInfo.summaryId}`, 
                    slug: summaryInfo.slug, 
                    title: summaryInfo.title, 
                    teaser: summaryInfo.teaser, 
                    imageUri: summaryInfo.imageUri,
                    summaryInfo: JSON.stringify(summaryInfo) 
                }
            }
        }),
        fallback: true
    };
  }

async function fetchServerSideBookSummaryInfo(context: GetStaticPropsContext) {
    return summary.summaries.find(x => x.summaryId == Number(context.params.id));
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
    const [summaryContents, setSummaryContents] = useState('');
    const [error, setError] = useState('');
    const [summaryInfo, setSummaryInfo] = useState<BookSummaryInfo>({
        summaryId: 0,
        title: '',
        author: '',
        link: ',',
        teaser: '',
        imageUri: '',
        isReady: false,
        slug: '',
        quality: 0,
        payoff: 0
    });

    useEffect(() => {
        props.summaryInfo && setSummaryInfo(JSON.parse(props.summaryInfo) as BookSummaryInfo);
    }, [props]);

    useEffect(() => {
        summaryInfo.slug && fetchBookSummaryContents(summaryInfo.slug)
            .then(summaryContents => {
                markdownToHtml(summaryContents.data)
                .then(processedContent => {
                    setSummaryContents(processedContent);
                })
            })
        .catch(error => setError(error.toString()));
    }, [summaryInfo.slug]);
    
    return <>
        <Head>
            <title key="original-title">{`${props.title} | Daniel Sabbagh`}</title>
            <meta property="og:title" content={`${props.title} | Daniel Sabbagh`} key="title" />
            <meta property="og:description" content={props.teaser} key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content={`https://danielsabbagh.com/${props.imageUri}`} key="image" />

            <meta name="twitter:title" content={`${props.title} | Daniel Sabbagh`} key="twitter-title" />
            <meta name="twitter:description" content={props.teaser} key="twitter-description" />
            <meta name="twitter:image" content={`https://danielsabbagh.com/${props.imageUri}`} key="twitter-image" />
            <meta name="twitter:card" content={`https://danielsabbagh.com/${props.imageUri}`} key="twitter-image" />
            <meta name="twitter:creator" content="@_danielsabbagh" />
            <meta name="twitter:site" content="@_danielsabbagh" key="twitter-site" />
        </Head>
            <div className={styles.outer}>
            
                <h1 className={styles.summaryBookTitle}>{summaryInfo && summaryInfo.title}</h1>
                <p className={styles.author}>{summaryInfo && summaryInfo.author}</p>

                <div className={styles.metrics}>
                    <div className={styles.metricsTitles}>
                        <p className={styles.qualityTitle}>Quality </p>
                        <p className={styles.payoffTitle}>Payoff </p>
                    </div>
                    <div className={styles.metricsMeasures}>
                        <p className={styles.qualityMeasure}>{summaryInfo && getQualityRanking(summaryInfo.quality)}</p>
                        <p className={styles.payoffMeasure}>{summaryInfo && getPayoffRanking(summaryInfo.payoff)}</p>
                    </div>
                </div>
                <br />

                <div className={styles.inner}>
                    <a href={summaryInfo.link} target="_blank">
                        <img className={styles.summaryBookImage} src={summaryInfo && `/${summaryInfo.imageUri}`} /> 
                    </a>
                    <div className={styles.teaserAndButton}>
                        <p className={styles.teaser}>{summaryInfo && summaryInfo.teaser}</p>
                        <a href={summaryInfo.link} target="_blank"><img className={styles.buyButton} src="/static/amazon-button.png" /> </a>
                    </div>
                </div>

                <br />
                <p className={styles.review}>Review</p>
                <br />

                <div className={!error && !summaryContents ? styles.dimOverlay : ''}>

                    {!summaryContents && <div className={!error && !summaryContents ? `${styles.dimOverlay} ${styles.summaryContents}` : styles.summaryContents}>
                        <p>Loading review...</p>
                    </div>}
                    <div className={styles.summaryContents} dangerouslySetInnerHTML={{ __html: summaryContents }}></div>

                    <br />
                    <p className={styles.summaryContents}>You can get yourself a copy of the book <a href={summaryInfo && summaryInfo.link} target="_blank">here</a>.</p>
                    <br />
                    <br />
                </div>
            </div>
        </>
}