import { useEffect, useState, useRef } from 'react';
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
                ogImageUri: summaryInfo.ogImageUri,
                summaryInfo: JSON.stringify(summaryInfo) 
            }
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
                    ogImageUri: summaryInfo.ogImageUri,
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

function buildShareToSocialLink(selection: string, socialPlatform: string, setSocialLink: Function): string {
    if (typeof window === "undefined") {
        return;
    }

    let link = "";

    if (socialPlatform == "twitter") {
        link += "https://twitter.com/intent/tweet?";
        link += "url=" + escape(document.URL);
        link += "&text=" + escape(selection + ' ...');
    } else if (socialPlatform == "facebook") {
        link += "https://www.facebook.com/dialog/share?&display=popup";
        link += `&href=${document.URL}`;
        link += "&app_id=2863776890531694";
        link += `&redirect_uri=${document.URL}`;
        link += "&quote=" + escape(selection) + ' ...';
    }

    setSocialLink(link);
}

export default function Summary(props) {
    const refContainer = useRef();
    const [socialLink, setSocialLink] = useState('');

    const [summaryContents, setSummaryContents] = useState('');
    const [error, setError] = useState('');
    const [summaryInfo, setSummaryInfo] = useState<BookSummaryInfo>({
        summaryId: 0,
        title: '',
        author: '',
        link: ',',
        teaser: '',
        imageUri: '',
        ogImageUri: '',
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
            <meta property="og:image" content={`https://danielsabbagh.com/${props.ogImageUri}`} key="image" />

            <meta name="twitter:title" content={`${props.title} | Daniel Sabbagh`} key="twitter-title" />
            <meta name="twitter:description" content={props.teaser} key="twitter-description" />
            <meta name="twitter:image" content={`https://danielsabbagh.com/${props.ogImageUri}`} key="twitter-image" />
            <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
            <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />
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
                    <a className={styles.bookLink} href={summaryInfo.link} target="_blank">
                        <img className={styles.summaryBookImage} src={summaryInfo && `/${summaryInfo.imageUri}`} /> 
                    </a>
                    <div className={styles.teaserAndButton}>
                        <div className={styles.teaserWrapper}>
                            <p className={styles.teaser}>{summaryInfo && summaryInfo.teaser}</p>
                            <div className={styles.socialWrapper}>
                                <a href={socialLink} onClick={() => buildShareToSocialLink(summaryInfo.teaser, "facebook", setSocialLink)} target="_blank">
                                    <img className={styles.socialIcon} alt="facebook share" src="/static/facebook-filled.png"></img>
                                </a>
                                &nbsp; 
                                <a href={socialLink} onClick={() => buildShareToSocialLink(summaryInfo.teaser, "twitter", setSocialLink)} target="_blank">
                                    <img className={styles.socialIcon} alt="twitter share" src="/static/twitter-filled.png"></img>
                                </a>
                            </div>
                        </div>
                        <a href={summaryInfo.link} target="_blank"><img className={styles.buyButton} src="/static/amazon-button.png"/> </a>
                    </div>
                </div>

                <br />
                <p className={styles.review}>Review</p>

                <div className={!error && !summaryContents ? styles.dimOverlay : ''}>

                    {!summaryContents && <div className={!error && !summaryContents ? `${styles.dimOverlay} ${styles.summaryContents}` : styles.summaryContents}>
                        <p>Loading review...</p>
                    </div>}
                    <div ref={refContainer} contentEditable="false" className={styles.summaryContents} dangerouslySetInnerHTML={{ __html: summaryContents }}></div>

                    <br />
                    <br />
                </div>

                <div>
                    <p className="disclaimerText">I'm a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.</p>
                </div>
            </div>
        </>
}