import { useEffect, useState, useRef } from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import remark from 'remark';
import html from 'remark-html';
import blogpost from '../../../data/blogpost.json';
import styles from '../../../styles/Blog.module.css';
import dynamic from 'next/dynamic';

const Popover = dynamic(
    () => import('react-text-selection-popover'),
    { ssr: false }
)

const MyPopover: any = Popover; // to get around selectionRef not being defined

async function markdownToHtml(markdown: string) {
    const result = await remark().use(html).process(markdown)
    return result.toString();
}

export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        const postInfo = await fetchServerSideBlogPostInfo(context);
        return {
            props: {
                id: context.params.id,
                slug: context.params.slug,
                title: postInfo.title,
                teaser: postInfo.teaser,
                imageUri: postInfo.imageUri,
                postInfo: JSON.stringify(postInfo)
            }
        }
    } catch (error) {
        return { notFound: true }
    }
}

export async function getStaticPaths() {
    const blogPosts = blogpost.blogposts;

    return {
        paths: blogPosts.map((blogPostInfo) => {
            return {
                params: {
                    id: `${blogPostInfo.blogpostId}`,
                    slug: blogPostInfo.slug,
                    title: blogPostInfo.title,
                    teaser: blogPostInfo.teaser,
                    imageUri: blogPostInfo.imageUri,
                    blogPostInfo: JSON.stringify(blogPostInfo)
                }
            }
        }),
        fallback: true
    };
}

async function fetchServerSideBlogPostInfo(context: GetStaticPropsContext) {
    return blogpost.blogposts.find(x => x.blogpostId == Number(context.params.id));
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

// this only used by the about page, which I should move to its own page
// function getNumberOfDaysMarried(): number {
//     const today = new Date().getTime();
//     const married = new Date('08-01-2020').getTime();
//     return Math.floor((today - married) / (1000 * 3600 * 24));
// }

function buildShareToSocialLink(socialPlatform: string, setSocialLink: Function): string {
    if (typeof window === "undefined") {
        return;
    }

    let link = "";
    const selection = window.getSelection().toString().slice(0, 140) + '...';

    if (socialPlatform == "twitter") {
        link += "https://twitter.com/intent/tweet?";
        link += "url=" + escape(document.URL);
        link += "&text=" + escape(selection);
    } else if (socialPlatform == "facebook") {
        link += "https://www.facebook.com/dialog/share?&display=popup";
        link += `&href=${document.URL}`;
        link += "&app_id=2863776890531694";
        link += `&redirect_uri=${document.URL}`;
        link += "&quote=" + escape(selection);
    }

    setSocialLink(link);
}

export default function Blog(props) {
    const refContainer = useRef();
    const [socialLink, setSocialLink] = useState('');

    // hope to get this working soon
    // const daysMarried = useRef();
    // daysMarried.current = getNumberOfDaysMarried();

    const [postContents, setPostContents] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showRelatedPosts, setShowRelatedPosts] = useState(false);
    const [isRelatedPostsLoading, setIsRelatedPostsLoading] = useState(false);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostInfoByTag[]>([]);
    const [tag, setTag] = useState('');

    const [postInfo, setPostInfo] = useState<BlogPostInfo>(
        { blogpostId: 1, slug: null, title: '', teaser: '', isReady: true, date: '', imageUri: '', tags: [] }
    );

    useEffect(() => {
        props && setPostInfo(JSON.parse(props.postInfo) as BlogPostInfo);
    }, [props]);

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

    useEffect(() => {
        postInfo.slug && fetchBlogPostContents(postInfo.slug)
            .then(postContents => {
                markdownToHtml(postContents.data)
                    .then(processedContent => {
                        setPostContents(processedContent);
                        setIsLoading(false);
                    });
            })
            .catch(error => setError(error.toString()));
    }, [postInfo.slug]);

    // clear related posts when loading new blog post
    useEffect(() => {
        setRelatedPosts([]);
        setShowRelatedPosts(false);
    }, [isLoading]);

    return <>
        <Head>
            <title key="original-title">{`${props.title} | Daniel Sabbagh`}</title>
            <meta property="og:title" content={`${props.title} | Daniel Sabbagh`} key="title" />
            <meta property="og:description" content={props.teaser} key="description" />
            <meta property="og:type" content="article" key="type" />
            <meta property="og:image" content={`https://danielsabbagh.com/${props.imageUri}`} key="image" />

            <meta name="twitter:site" content="@_danielsabbagh" key="twitter-site" />
            <meta name="twitter:title" content={`${props.title} | Daniel Sabbagh`} key="twitter-title" />
            <meta name="twitter:description" content={props.teaser} key="twitter-description" />
            <meta name="twitter:image" content={`https://danielsabbagh.com/${props.imageUri}`} key="twitter-image" />
            <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
            <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />
        </Head>
        <div className={styles.blogLayout}>
            <h1 className={styles.pageTitle}>{props.title}</h1>

            <br />
            <div className={isLoading ? `${styles.dimOverlay}` : ''}>

                {!postContents &&
                    <div className={isLoading ? `${styles.preloadPost} ${styles.slidePostIn} ${styles.postContents}` : `${styles.preloadPost} ${styles.postContents}`}>
                        <p>Loading ...</p>
                    </div>}
                <MyPopover selectionRef={refContainer}>
                    <div className={styles.socialPopoverWrapper}>
                        <a href={socialLink} onClick={() => buildShareToSocialLink("facebook", setSocialLink)} target="_blank">
                            <img
                                className={styles.socialIcon}
                                alt="facebook share"
                                src="/static/facebook-filled.png"></img>
                        </a>
                        &nbsp;
                        <a href={socialLink} onClick={() => buildShareToSocialLink("twitter", setSocialLink)} target="_blank">
                            <img className={styles.socialIcon} alt="twitter share" src="/static/twitter-filled.png"></img>
                        </a>
                    </div>
                </MyPopover>
                <div ref={refContainer} contentEditable="false" className={styles.postContents} dangerouslySetInnerHTML={{ __html: postContents }}></div>
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
                                            <a className={styles.postLinks} onClick={() => setIsLoading(true)}>
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

                        {relatedPosts.length == 0 && showRelatedPosts && <p className={styles.noRelatedPostsText}>Looks like there aren't any other posts with this tag 😔 <a href="mailto:dsabbaghumd@gmail.com" target="_blank">Want me to write one?</a></p>}
                    </div>

                    <br />
                    <div>
                        <p className="disclaimerText">I'm a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.</p>
                    </div>
                </div>
            </div>
        </div>
    </>
}