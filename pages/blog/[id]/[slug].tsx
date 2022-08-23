import fs from 'fs';
import path from 'path';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import DaysMarried from '../../../components/DaysMarried';
import blogpost from '../../../data/blogpost.json';
import styles from '../../../styles/Blog.module.css';

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  try {
    // get blog post (move to separate function)
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
        tags: postInfo.tags,
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
          slug: blogPostInfo.slug
        }
      }
    }),
    fallback: false
  };
}

async function fetchBlogPostInfoByTag(tag: string): Promise<BlogPostInfoByTag[]> {
  let response = await fetch(`/api/blogpost-info-by-tag/${tag}`);
  if (response.status >= 400) {
    throw new Error("Bad response from server") // todo make this better
  }

  return await response.json() as Promise<BlogPostInfoByTag[]>;
}

export default function Blog(props) {
  const [showRelatedPosts, setShowRelatedPosts] = useState(true);
  const [isRelatedPostsLoading, setIsRelatedPostsLoading] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostInfoByTag[]>([]);
  const [tag, setTag] = useState('');
  const [postLikes, setPostLikes] = useState(0);

  const dynamicRoute = useRouter().asPath;

  // examine this; it looks really bad to have four setters at the end there
  async function displayBlogPostsByTag(newTag: string) {
    if (newTag == tag) {
      setShowRelatedPosts(!showRelatedPosts);
      return;
    }

    setIsRelatedPostsLoading(true);

    const related = (await fetchBlogPostInfoByTag(newTag)).filter(x => x.blogpostId != props.id);
  
    setRelatedPosts(related);
    setShowRelatedPosts(true);
    setTag(newTag);
    setIsRelatedPostsLoading(false);
  }

  const addLike = async () => {
    const response = await fetch(`/api/likes`, {
      method: 'POST',
      headers: {
          'content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: props.id,
        slug: props.slug
      })
    });
    const data = await response.json() as LikesItem;
    setPostLikes(data.likes);
  }

  // clear related posts when loading new blog post
  useEffect(() => {
    setRelatedPosts([]);
    setShowRelatedPosts(false);
    setPostLikes(0);
    setTag('');
  }, [dynamicRoute]);

  useEffect(() => {
    const getLikes = async () => {
      const response = await fetch(`/api/likes?id=${props.id}&slug=${props.slug}`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        },
      });

      const data = await response.json() as LikesItem;
      setPostLikes(data.likes);
    }

    getLikes();
  }, [postLikes, dynamicRoute]);

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
          <MDXRemote {...props?.postContents} components={{DaysMarried}}></MDXRemote>
        </div>
        <div>
          {props.tags?.length > 0 &&
          <div className={styles.postTagContainer}>
            <div>
              <p className={styles.relatedPostsText}>related:</p>
            </div>
            {props.tags.map((tag) => (
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
            
            {relatedPosts.length == 0 && showRelatedPosts && <p className={styles.noRelatedPostsText}>Looks like there aren't any other posts with this tag 😔 <a href="mailto:dsabbaghumd@gmail.com" target="_blank">Want me to write one?</a></p>}
          </div>

          <a onClick={() => addLike()}>
            <p>LIKES: {postLikes}</p>
          </a>

          <br />
          <div>
            <p className="disclaimerText">I'm a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.</p>
          </div>
        </div>
        </div>
      </div>
    </>
}