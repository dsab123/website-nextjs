import { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import blogpost from '../../../data/blogpost.json';
import styles from '../../../styles/Blog.module.css';
import { serialize } from 'next-mdx-remote/serialize';
import DaysMarried from '../../../components/DaysMarried';
import { MDXRemote } from 'next-mdx-remote';
import path from 'path';

const components = { DaysMarried }
export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  try {
    const postInfo = blogpost.blogposts.find(x => x.blogpostId == Number(context.params.id));

    const postsDirectory = path.join(process.cwd(), 'data/blogposts');
    const fullPath = `${postsDirectory}/${context.params.slug}.md`;

    const postContents = fs.readFileSync(fullPath, 'utf8');

    const mdxSource = await serialize(postContents);

    return {
      props: { 
        id: context.params.id, 
        slug: context.params.slug.toString(), 
        title: postInfo.title, 
        teaser: postInfo.teaser, 
        imageUri: postInfo.imageUri,
        postInfo: JSON.stringify(postInfo),
        postContents: mdxSource
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

async function fetchBlogPostInfoByTag(tag: string): Promise<BlogPostInfoByTag[]> {
  let response = await fetch(`/api/blogpost-info-by-tag/${tag}`);
  if (response.status >= 400) {
    throw new Error("Bad response from server") // todo make this better
  }

  return await response.json() as Promise<BlogPostInfoByTag[]>;
}


export default function Blog(props) {
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
  },[props]);

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
        <meta name="twitter:card"  content="summary_large_image" key="twitter-card" />
        <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />

        {/* need to add twitter og tags */}
      </Head>
      <div className={styles.blogLayout}>
        <h1 className={styles.pageTitle}>{props.title}</h1>

        <br />
        <div >
          <br />
          <div className={styles.postContents}>
            <MDXRemote {...props.postContents} components={components}></MDXRemote>
          </div>
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