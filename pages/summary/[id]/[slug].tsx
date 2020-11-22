import { useState } from 'react';
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Head from 'next/head';
import { GetStaticPropsContext } from 'next';

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
    // we have to use the base API route here instead of 
    const raw = await fetch(`https://7dfaiqkhk5.execute-api.us-east-1.amazonaws.com/stage/booksummary-lookup/`);
    const summaryInfos = await raw.json();
    
    return {
        paths: summaryInfos.map((summaryInfo) => {
            return {
                params: { id: `${summaryInfo.summary_id}`, slug: summaryInfo.slug, summaryInfo: JSON.stringify(summaryInfo) },
            }
        }),
        fallback: true
    };
  }


async function fetchServerSideBookSummaryInfo(context: GetStaticPropsContext) {
    const protocol = context.params; //.split('://')[0];

    //const response = await fetch(`${protocol}://${context.params.headers['host']}/api/booksummary-info/${context.params.id}`);
    //const response = await fetch(`/api/booksummary-info/${context.params.id}`);
    const response = await fetch(`https://7dfaiqkhk5.execute-api.us-east-1.amazonaws.com/stage/booksummaryinfo?summary_id=${context.params.id}`);
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
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/silver.jpg" key="image" />
        </Head>
            <Header></Header>
            <p>Header is up here?</p>
            <br />
            {summaryInfo && <h1>Summary - {summaryInfo && summaryInfo.title}</h1>}
            {summaryInfo && <h2>by {summaryInfo && summaryInfo.author}</h2>}
            {summaryInfo && <img src={summaryInfo && `/${summaryInfo.image_uri}`}></img>}
            {!error && !summaryContents && <p>Loading review...</p>}
            {summaryContents && <p>{summaryContents.data}</p>}
            <Footer></Footer>
        </>
}