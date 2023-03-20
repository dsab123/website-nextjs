import Head from 'next/head'
import { useState, useLayoutEffect, useEffect } from 'react';
import styles from '../styles/Blogs.module.css';
import BlogPostCard from '../components/BlogPostCard';
import Disclaimer from '../components/Disclaimer';

async function fetchBlogPostLookup(): Promise<BlogPostInfo[]> {
    let response = await fetch('/api/blogpost-lookup');

    if (response.status >= 400) {
        throw new Error("Bad response from server")
    }

    const blogpostLookup =  await response.json() as BlogPostInfo[];

    return blogpostLookup.filter(x => x.isReady);
}

export default function Blogs() {
    const [isBlogPostsLoading, setIsBlogPostsLoading] = useState(true);
    const [allLikes, setAllLikes] = useState<LikesItem[]>([]);

    const [posts, setPosts] = useState<BlogPostInfo[]>([
        {blogpostId: 1, slug: "slug", title: "", teaser: "", tags: [], imageUri: "", date: "", isReady: true},
        {blogpostId: 2, slug: "slug", title: "", teaser: "", tags: [], imageUri: "", date: "", isReady: true},
        {blogpostId: 3, slug: "slug", title: "", teaser: "", tags: [], imageUri: "", date: "", isReady: true},
        {blogpostId: 4, slug: "slug", title: "", teaser: "", tags: [], imageUri: "", date: "", isReady: true},
        {blogpostId: 5, slug: "slug", title: "", teaser: "", tags: [], imageUri: "", date: "", isReady: true},
        {blogpostId: 6, slug: "slug", title: "", teaser: "", tags: [], imageUri: "", date: "", isReady: true},
    ]);

    useEffect(() => {
        fetchBlogPostLookup()
            .then(posts => {
                if (isBlogPostsLoading) {
                    setPosts(posts);
                    setIsBlogPostsLoading(false);
                }
            })
            .catch(error => isBlogPostsLoading ? console.log(error.toString()) : null);
    }, []);

    useEffect(() => {
        const getAllLikes = async () => {
            const response = await fetch(`/api/all-likes`, {
              method: 'GET',
              headers: {
                  'content-Type': 'application/json'
              },
            });

            const allLikesData = await response.json() as LikesItem[];

            setAllLikes(allLikesData);
          };

        getAllLikes();
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
                <BlogPostCard key={post.blogpostId} isLoading={isBlogPostsLoading} post={post} setIsLoading={setIsBlogPostsLoading} likes={allLikes.find(i => i.id == post.blogpostId)?.likes ?? 0}></BlogPostCard>
            ))}
            </div>
        </div>
        <br />

        <Disclaimer />
    </>
}