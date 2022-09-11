import fs from 'fs';
import path from 'path';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Likes from '../../../components/Likes';
import DaysMarried from '../../../components/DaysMarried';
import blogpost from '../../../data/blogpost.json';
import styles from '../../../styles/Blog.module.css';
import Disclaimer from '../../../components/Disclaimer';
import RelatedPosts from '../../../components/RelatedPosts';

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
        date: postInfo.date,
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


  // clear related posts when loading new blog post
  useEffect(() => {
    setRelatedPosts([]);
    setShowRelatedPosts(false);
    setPostLikes(0);
    setTag('');
  }, [dynamicRoute]);

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


      <div className={styles.topMatter}>
        <p className={styles.date}><em>{props.date}</em></p>
        <Likes id={props.id} slug={props.slug} navigationChange={dynamicRoute} likes={postLikes} setLikes={setPostLikes}/>
      </div>
      <div className={styles.separator}></div>

      <div >
        <br />
        <div className={styles.postContents}>
          <MDXRemote {...props?.postContents} components={{DaysMarried}}></MDXRemote>
        </div>

        <br />

        <div className={styles.likesWrapper}>
            <Likes id={props.id} slug={props.slug} navigationChange={dynamicRoute} likes={postLikes} setLikes={setPostLikes}/>
        </div>

        <div className={styles.bottomMatter}>
          <RelatedPosts
            tags={props.tags}
            relatedPosts={relatedPosts}
            isRelatedPostsLoading={isRelatedPostsLoading}
            displayBlogPostsByTag={displayBlogPostsByTag}
            showRelatedPosts={showRelatedPosts}
            tag={tag} />
          <br />
        </div>
        <Disclaimer />
        </div>
      </div>
    </>
}