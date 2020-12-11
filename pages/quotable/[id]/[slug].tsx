import { useEffect, useState } from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import remark from 'remark';
import html from 'remark-html';
import RelatedItems from '../../../components/RelatedItems';
import quotable from '../../../data/quotable.json';
import styles from '../../../styles/Quotable.module.css';

async function markdownToHtml(markdown: string) {
    const result = await remark().use(html).process(markdown)
    return result.toString();
}

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
            props: {id: context.params.id, slug: context.params.slug, quotable: JSON.stringify(quotable) }
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
                params: {id: `${quotable.quotableId}`, slug: quotable.slug, quotable: JSON.stringify(quotable) }
            }
        }),
        fallback: true
    };
}

async function fetchServerSideQuotable(context: GetStaticPropsContext) {
    const response = await fetch(`${process.env.VERCEL_URL}/api/quotable-info/${context.params.id}`);

    if (response.status >= 400) {
        throw new Error("Bad response from server") // todo make this better        
    }

    const r = await response.json();

    return r;
}

export default function Quotable(props) {
    const quotable = props.quotable && JSON.parse(props.quotable) as Quotable;
    
    return <>
        <Head>
            <title key="original-title">{`${quotable && quotable.title} | Daniel Sabbagh`}</title>
            <meta property="og:title" content={`${quotable && quotable.title} | Daniel Sabbagh`} key="title" />
            <meta property="og:description" content={quotable && quotable.teaser} key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content={`${process.env.VERCEL_URL}/${quotable && quotable.imageUri}`} key="image" />
        </Head>

        <div className={styles.wrapper}>            
            <h1 className={styles.quotableTitle}>{quotable && quotable.title}</h1>
            <br />

            <div className={styles.quotableContentWrapper}>
                <img className={styles.quotableImage} src={quotable && `/${quotable.imageUri}`} /> 
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