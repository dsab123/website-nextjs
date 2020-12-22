import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import RelatedItems from '../../../components/RelatedItems';
import quotable from '../../../data/quotable.json';
import styles from '../../../styles/Quotable.module.css';

type Quotable = {
    quotableId: number,
    title: string,
    author: string,
    imageUri: string,
    teaser: string,
    slug: string,
    tags: Array<string>,
    quote: string,
    content: string
}

export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        const quotable = await fetchServerSideQuotable(context);
        return {
            props: {
                id: context.params.id, 
                slug: context.params.slug, 
                title: quotable.title, 
                teaser: quotable.teaser, 
                imageUri: quotable.imageUri, 
                quotable: JSON.stringify(quotable) 
            }
        }
    } catch (error) {
        return { notFound: true }
    }
}

export async function getStaticPaths() {
    const quotables = quotable.quotables;
    
    return {
        paths: quotables.map((quotable) => {
            return {
                params: {
                    id: `${quotable.quotableId}`, 
                    slug: quotable.slug, 
                    title: quotable.title, 
                    teaser: quotable.teaser, 
                    imageUri: quotable.imageUri, 
                    quotable: JSON.stringify(quotable) 
                }
            }
        }),
        fallback: true
    };
}

async function fetchServerSideQuotable(context: GetStaticPropsContext) {
    return quotable.quotables.find(x => x.quotableId == Number(context.params.id));
}

export default function Quotable(props) {
    const [quotable, setQuotable]  = useState<Quotable>({
        quotableId: 0,
        title: '',
        author: '',
        imageUri: '',
        teaser: '',
        slug: '',
        tags: [],
        quote: '',
        content: ''
    });

    useEffect(() => {
        props.quotable && setQuotable(JSON.parse(props.quotable) as Quotable);
    },[props]);
    
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
            <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
            <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />
            <meta name="twitter:site" content="@_danielsabbagh" key="twitter-site" />
        </Head>

        <div className={styles.wrapper}>            
            <h1 className={styles.quotableTitle}>{props.title}</h1>
            <br />

            <div className={styles.quotableContentWrapper}>
                <img className={styles.quotableImage} src={`/${props.imageUri}`} /> 
                <p className={styles.quotableQuoteWrapper}>
                    <span className={styles.quotableQuote}>{quotable && quotable.quote}</span>
                    &nbsp;—&nbsp;
                    <span className={styles.quotableAuthor}>{quotable && quotable.author}</span>
                </p>
            
            <br />
            
                <div className={styles.quotableAdditionalContent}>{quotable && quotable.content}</div>
            </div>
            
            <br />
            <div className={styles.relatedTagsWrapper}>
                {quotable && quotable.tags && quotable.tags.length > 0 && 
                    <RelatedItems isLoading={false} items={quotable.tags} displayPost={() => {}}></RelatedItems>
                }
            </div>

        </div>
    </>;
}