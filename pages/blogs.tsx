import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react';

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

export default function Blogs() {
    const [posts, setPosts] = useState<BlogPostLookupItem[]>([]);
    const [error, setError] = useState('');
    
    useEffect(() => { 
        let isSubscribed = true;
        fetchBlogPostLookup()
            .then(posts => (isSubscribed ? setPosts(posts) : null))
            .catch(error => (isSubscribed ? setError(error.toString()) : null));
        return () => (isSubscribed = false);
    }, []);
    
    return <>
        <Head>
            <meta property="og:title" content="Recent Blog posts | Daniel Sabbagh" key="title" />
            <meta property="og:description" content="Cool Sweet Blog posts aww yiss" key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content="https://website-nextjs-nine.vercel.app/favicon.ico" key="image" />
        </Head>
        <ul>
            {posts.length == 0 && <p className="loading">loading...</p>}
            {posts.map((post) => (
                <li key={post.blogpost_id}>
                <Link
                    href={{
                        pathname: '/blog/[slug]',
                        query: { slug: post.slug },
                    }}
                >
                <a>{post.title}</a>
            </Link>
            </li>
            ))}
        </ul>
    </>;
}