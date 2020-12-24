import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import styles from '../styles/Blogs.module.css';
import BlogPostCard from '../components/BlogPostCard';
import QuotableCard from '../components/QuotableCard';

type BlogPostLookupItem = {
    blogpostId: number,
    slug: string,
    title: string,
    teaser: string,
    imageUri: string,
    isReady: boolean
};

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
};

async function fetchBlogPostLookup(): Promise<BlogPostLookupItem[]> {
    let response = await fetch('/api/blogpost-lookup');

    if (response.status >= 400) {
        throw new Error("Bad response from server")
    }

    const blogpostLookup =  await response.json() as BlogPostLookupItem[];

    return blogpostLookup.filter(x => x.isReady);
}

async function fetchQuotableLookup(): Promise<Quotable[]> {
    let response = await fetch('/api/quotable-lookup');

    if (response.status >= 400) {
        throw new Error("Bad response from server")
    }

    return await response.json() as Quotable[];
}

// for testing
// async function fetchFakeBlogPostLookup(): Promise<BlogPostLookupItem[]> {
//     await sleep(15000);
//     return [
//         {blogpostId: 1, slug: "slug", title: "string", teaser: "string", isReady: true},
//         {blogpostId: 2, slug: "slug", title: "string", teaser: "string", isReady: true},
//         {blogpostId: 3, slug: "slug", title: "string", teaser: "string", isReady: true},
//         {blogpostId: 4, slug: "slug", title: "string", teaser: "string", isReady: true},
//         {blogpostId: 5, slug: "slug", title: "string", teaser: "string", isReady: true},
//         {blogpostId: 6, slug: "slug", title: "string", teaser: "string", isReady: true},
//     ] as BlogPostLookupItem[];
// }
  
export default function Blogs() {
    const [error, setError] = useState('');
    const [isBlogPostsLoading, setIsBlogPostsLoading] = useState(true);
    const [dotCount, setDotCount] = useState(0);
    let dots = ['.', '..', '...', '..'];

    const [posts, setPosts] = useState<BlogPostLookupItem[]>([
        {blogpostId: 1, slug: "slug", title: "", teaser: "", imageUri: "", isReady: true},
        {blogpostId: 2, slug: "slug", title: "", teaser: "", imageUri: "", isReady: true},
        {blogpostId: 3, slug: "slug", title: "", teaser: "", imageUri: "", isReady: true},
        {blogpostId: 4, slug: "slug", title: "", teaser: "", imageUri: "", isReady: true},
        {blogpostId: 5, slug: "slug", title: "", teaser: "", imageUri: "", isReady: true},
        {blogpostId: 6, slug: "slug", title: "", teaser: "", imageUri: "", isReady: true},
    ]);

    useEffect(() => {
        fetchBlogPostLookup()
            .then(posts => {
                if (isBlogPostsLoading) {
                    setPosts(posts);
                    setIsBlogPostsLoading(false);
                }
            })
            .catch(error => isBlogPostsLoading ? setError(error.toString()) : null);
    }, []);


    const [isQuotablesLoading, setIsQuotablesLoading] = useState(true);
    const [quotables, setQuotables] = useState<Quotable[]>([
        {quotableId: 1,title: "",author: "",imageUri: "",teaser: "",slug: "slug",tags: [],quote: "",content: ""},
        {quotableId: 2,title: "",author: "",imageUri: "",teaser: "",slug: "slug",tags: [],quote: "",content: ""},
    ]);
    
    useEffect(() => {
        fetchQuotableLookup()
            .then(quotables => {
                if (isQuotablesLoading) {
                    setQuotables(quotables);
                    setIsQuotablesLoading(false);
                }
            })
            .catch(error => isQuotablesLoading ? setError(error.toString()) : null);
    }, []);
    
    return <>
        <Head>
            <title key="original-title">Recent Blog Posts | Daniel Sabbagh</title>
            <meta property="og:title" content="Blog | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="Resources to help you read better." key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content={`https://danielsabbagh.com/static/mobile-logo-large.jpg`} key="image" />

            <meta name="twitter:title" content="Resources to Help You Read Better | Daniel Sabbagh" key="twitter-title" />
            <meta name="twitter:description" content="Resources to help you read better." key="twitter-description" />
            <meta name="twitter:image" content={`https://danielsabbagh.com/static/mobile-logo-large.jpg`} key="twitter-image" />
            <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
            <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />
            <meta name="twitter:site" content="@_danielsabbagh" key="twitter-site" />
        </Head>

        <h1 className={styles.pageTitle}>Recent Posts</h1>

        <div className={isBlogPostsLoading ? styles.dimOverlay : ''}>
            <div className={styles.cardRecentPostsContainer}>  
            {posts.map((post) => (
                <BlogPostCard isLoading={isBlogPostsLoading} post={post} setIsLoading={setIsBlogPostsLoading}></BlogPostCard>
            ))}
            </div>
        </div>

        <h1 className={styles.pageTitle}>Recent Quotables</h1>

        <div className={isQuotablesLoading ? styles.dimOverlay : ''}>
            <div className={styles.cardRecentPostsContainer}>  
            {quotables.map((quotable) => (
              <QuotableCard isLoading={isQuotablesLoading} quotable={quotable} setIsLoading={setIsQuotablesLoading}></QuotableCard>          
            ))}
            </div>
        </div>
    </>
}