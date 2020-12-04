import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import styles from '../styles/Blogs.module.css';

type BlogPostLookupItem = {
    blogpost_id: number,
    slug: string,
    title: string,
    teaser: string,
    is_ready: boolean
};

async function fetchBlogPostLookup(): Promise<BlogPostLookupItem[]> {
    let response = await fetch('/api/blogpost-lookup');

    if (response.status >= 400) {
        throw new Error("Bad response from server")
    }

    return await response.json() as BlogPostLookupItem[];
}

// for testing
// async function fetchFakeBlogPostLookup(): Promise<BlogPostLookupItem[]> {
//     await sleep(15000);
//     return [
//         {blogpost_id: 1, slug: "slug", title: "string", teaser: "string", is_ready: true},
//         {blogpost_id: 2, slug: "slug", title: "string", teaser: "string", is_ready: true},
//         {blogpost_id: 3, slug: "slug", title: "string", teaser: "string", is_ready: true},
//         {blogpost_id: 4, slug: "slug", title: "string", teaser: "string", is_ready: true},
//         {blogpost_id: 5, slug: "slug", title: "string", teaser: "string", is_ready: true},
//         {blogpost_id: 6, slug: "slug", title: "string", teaser: "string", is_ready: true},
//     ] as BlogPostLookupItem[];
// }
  
export default function Blogs() {
    const [error, setError] = useState('');
    const [loadingText, setLoadingText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [dotCount, setDotCount] = useState(0);
    let dots = ['.', '..', '...', '..'];

    const [posts, setPosts] = useState<BlogPostLookupItem[]>([
        {blogpost_id: 1, slug: "", title: "", teaser: "", is_ready: true},
        {blogpost_id: 2, slug: "", title: "", teaser: "", is_ready: true},
        {blogpost_id: 3, slug: "", title: "", teaser: "", is_ready: true},
        {blogpost_id: 4, slug: "", title: "", teaser: "", is_ready: true},
        {blogpost_id: 5, slug: "", title: "", teaser: "", is_ready: true},
        {blogpost_id: 6, slug: "", title: "", teaser: "", is_ready: true},
    ]);

    useEffect(() => {        
        setTimeout(() => {
            if (isLoading) setDotCount(dotCount + 1);
            setLoadingText('Loading' + dots[dotCount % dots.length]);        
        }, 300);
    }, [dotCount, isLoading]);

    useEffect(() => {
        fetchBlogPostLookup()
            .then(posts => {
                if (isLoading) {
                    setPosts(posts);
                    setIsLoading(false);
                }
            })
            .catch(error => isLoading ? setError(error.toString()) : null);
    }, []);
    
    return <>
        <Head>
            <title key="main-title">Blog | Daniel Sabbagh</title>
            <meta property="og:title" content="Blog | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="Resources to help you read more." key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/mobile-logo.jpg" key="image" />
        </Head>

        <h2 className={styles.pageTitle}>Recent Posts</h2>

        <div className={isLoading ? styles.dimOverlay : ''}>
            {isLoading && <h3 className={styles.loadingText}>{loadingText}</h3>}
            <div className={styles.cardRecentPostsContainer}>  
            {posts.map((post) => (
                <div key={post.blogpost_id} className={styles.cardPostContainer}>
                    <Link href='/blog/[id]/[slug]' as={`/blog/${post.blogpost_id}/${post.slug}`}>
                        <a className={styles.postLinks} onClick={() => setIsLoading(true)}>
                            <div className={styles.cardPostContent}>
                                <img className={styles.cardPostImage} src="/silver.jpg" />
                                <p className={styles.cardPostTitle}>{post.title}</p>
                                <p className={styles.cardPostTeaser}>{!isLoading && `${post.teaser} ...`}</p>
                            </div>
                        </a>
                    </Link>
                </div>
            ))}    
            </div>
        </div>
    </>
}