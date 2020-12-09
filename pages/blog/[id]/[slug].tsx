import { useEffect, useState } from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import remark from 'remark'
import html from 'remark-html'
import styles from '../../../styles/Blog.module.css';

async function markdownToHtml(markdown: string) {
    const result = await remark().use(html).process(markdown)
    return result.toString();
}

type BlogPostContents = {
    data: string;
};

type BlogPostInfo = {
    blogpostId: number,
    slug: string,
    title: string,
    teaser: string,
    tags: Array<string>
};

type BlogPostInfoByTag = {
    blogpostId: number,
    slug: string,
    title: string,
    teaser: string
};

export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        const postInfo = await fetchServerSideBlogPostInfo(context);

        return {
            props: { id: context.params.id, slug: context.params.slug, postInfo: JSON.stringify(postInfo) }
        }
    } catch (error) {
        return { notFound: true }
    }
}

export async function getStaticPaths() {
    const raw = await fetch(`${process.env.HOST}/api/blogpost-lookup/`);
    
    const blogPosts = await raw.json();
    
    return {
        paths: blogPosts.map((blogPostInfo) => {
            return {
                params: { id: `${blogPostInfo.blogpostId}`, slug: blogPostInfo.slug, blogPostInfo: JSON.stringify(blogPostInfo) }
            }
        }),
        fallback: true
    };
  }

async function fetchServerSideBlogPostInfo(context: GetStaticPropsContext) {
    const response = await fetch(`${process.env.HOST}/api/blogpost-info/${context.params.id}`);
    if (response.status >= 400) {
        throw new Error("Bad response from server") // todo make this better
    }

    return await response.json();
}

async function fetchBlogPostContents(slug: string): Promise<BlogPostContents> {
    let response = await fetch(`/api/blogpost-contents/${slug}`);
    if (response.status >= 400) {
        throw new Error("Bad response from server") // todo make this better
    }

    return await response.json() as Promise<BlogPostContents>;
}

async function fetchBlogPostInfoByTag(tag: string): Promise<BlogPostInfoByTag[]> {
    let response = await fetch(`/api/blogpost-info-by-tag/${tag}`);
    if (response.status >= 400) {
        throw new Error("Bad response from server") // todo make this better
    }

    return await response.json() as Promise<BlogPostInfoByTag[]>;
}

export default function Blog(props) {
    const [postContents, setPostContents] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showRelatedPosts, setShowRelatedPosts] = useState(false);

    const [isRelatedPostsLoading, setIsRelatedPostsLoading] = useState(false);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostInfoByTag[]>([]);
    const [tag, setTag] = useState('');

    const postInfo = props.postInfo && JSON.parse(props.postInfo) as BlogPostInfo;

    async function displayBlogPostsByTag(newTag: string) {
        if (newTag == tag) {
            setShowRelatedPosts(!showRelatedPosts);
            return;
        }

        setIsRelatedPostsLoading(true);

        const related = (await fetchBlogPostInfoByTag(newTag)).filter(x => x.blogpostId !== postInfo.blogpostId);
        
        setRelatedPosts(related);
        setShowRelatedPosts(true);
        setTag(newTag);
        setIsRelatedPostsLoading(false);
    }

    if (props.slug) {
        fetchBlogPostContents(props.slug)
            .then(postContents => {
                markdownToHtml(postContents.data)
                .then(processedContent => {
                    setPostContents(processedContent);
                    setIsLoading(false);
                });
            })
            .catch(error => setError(error.toString()));
    }

    return <>
            <Head>
                <title key="original-title">{`${postInfo && postInfo.title} | Daniel Sabbagh`}</title>
                <meta property="og:title" content={`${postInfo && postInfo.title} | Daniel Sabbagh`} key="title" />
                <meta property="og:description" content={postInfo && postInfo.teaser} key="description" />
                <meta property="og:type" content="article" key="type" />
                <meta property="og:image" content="https://website-nextjs-nine.vercel.app/silver.jpg" key="image" />
            </Head>
            <div className={styles.blogLayout}>
                <h1 className={styles.pageTitle}>{postInfo && postInfo.title}</h1>

                <br />
                <div className={isLoading ? `${styles.dimOverlay}` : ''}>

                    {!postContents && 
                    <div className={isLoading ? `${styles.preloadPost} ${styles.slidePostIn} ${styles.postContents}` : `${styles.preloadPost} ${styles.postContents}`}>
                            <p>Loading blog post...</p>
                    </div>}
                    <div className={styles.postContents} dangerouslySetInnerHTML={{ __html: postContents }}></div>
                    <br />

                    <div>
                        {postInfo && postInfo.tags && postInfo.tags.length > 0 && 
                        <div className={styles.postTagContainer}>
                            <div>
                                <p className={styles.relatedPostsText}>related:</p>
                            </div>
                            {postInfo.tags.map((tag) => (
                            <div key={tag} className={isRelatedPostsLoading ? `${styles.postTags} ${styles.dimOverlay}` : styles.postTags}>
                                <a className={styles.postTag} 
                                onClick={() => displayBlogPostsByTag(tag)}>
                                    {tag}
                                </a>
                            </div>
                            ))}
                        </div>}

                        <br />

                        <div className={showRelatedPosts ? `${styles.preloadRelatedPosts} ${styles.slideRelatedPostsIn} ${styles.relatedPosts}` : `${styles.preloadRelatedPosts} ${styles.slideRelatedPostsOut} ${styles.relatedPosts}`}>
                            {relatedPosts.length > 0 && 
                            <p className={styles.relatedPostsText}>
                                <span>other posts tagged: <i>{tag}</i></span>
                            </p>}
                            
                            {relatedPosts.length > 0 &&
                            <ul>
                                {relatedPosts.map((relatedPost) =>
                                <li key={relatedPost.blogpostId}>
                                    <Link href='/blog/[id]/[slug]' as={`/blog/${relatedPost.blogpostId}/${relatedPost.slug}`}>
                                        <a className={styles.postLinks}>
                                        {relatedPost.title}
                                        <ul>
                                            <li>
                                                {relatedPost.teaser}
                                            </li>
                                        </ul>
                                        </a>
                                    </Link>
                                </li>
                                )}
                            </ul>}
                            
                            {relatedPosts.length == 0 && <p className={styles.noRelatedPostsText}>Looks like there aren't any other posts with this tag 😔 <a href="mailto:dsabbaghumd@gmail.com" target="_blank">Want me to write one?</a></p>}
                        </div>
                    </div>
                    <br />
                    <br />
                    </div>
                </div>
            </>
}