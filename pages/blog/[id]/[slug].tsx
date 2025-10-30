import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
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
import { formatDate } from '../../../lib/dateHelper';
import readingTime from 'reading-time';
import { motion, useScroll, useSpring } from 'motion/react';
import path from 'path';
import fs from 'fs';

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  try {
    // get blog post (move to separate function)
    const postInfo = blogpost.blogposts.find(x => x.blogpostId == Number(context.params.id));
    const postsDirectory = path.join(process.cwd(), 'data/blogposts');
    const fullPath = `${postsDirectory}/${context.params.slug}.md`;
    const postContents = fs.readFileSync(fullPath, 'utf8');
    const mdxSource = await serialize(postContents, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
        useDynamicImport: true,
      },
      parseFrontmatter: true,
    });
    const timeToRead = Math.floor(readingTime(postContents).minutes);

    return {
      props: {
        id: context.params.id,
        slug: context.params.slug.toString(),
        title: postInfo.title,
        teaser: postInfo.teaser,
        imageUri: postInfo.imageUri,
        tags: postInfo.tags,
        date: postInfo.date,
        postContents: mdxSource,
        timeToRead: timeToRead
      }
    };
  } catch (error) {
    return { notFound: true };
  }
};

export async function getStaticPaths() {
  const blogPosts = blogpost.blogposts;

  return {
    paths: blogPosts.map((blogPostInfo) => {
      return {
        params: {
          id: `${blogPostInfo.blogpostId}`,
          slug: blogPostInfo.slug
        }
      };
    }),
    fallback: false
  };
}


export default function Blog(props) {
  console.log('made it?!');
  const [postLikes, setPostLikes] = useState(0);

  // framer motion experiment
  const postContents = useRef(null);
  const { scrollYProgress } = useScroll({ target: postContents });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // clear related posts when loading new blog post
  const dynamicRoute = useRouter().asPath;

  useEffect(() => {
    setPostLikes(0);
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
      <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
      <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />
    </Head>
    <div className={styles.blogLayout}>
      <motion.div className={styles.progressBar} style={{ scaleX }} />

      <h1 className={styles.pageTitle}>{props.title}</h1>

      <p className={styles.date}><em>{formatDate(props.date)}</em></p>
      <div className={styles.topMatter}>
        {/* <Likes id={props.id} slug={props.slug} navigationChange={dynamicRoute} likes={postLikes} setLikes={setPostLikes} /> */}
        <p className={styles.readingTime}>{props.timeToRead} minutes</p>

      </div>
      <div className={styles.separator}></div>

      <div >
        <br />
        <div ref={postContents} className={styles.postContents}>
          <MDXRemote {...props?.postContents} components={{ DaysMarried }}></MDXRemote>
        </div>
        <br />

        <div className={styles.likesWrapper}>
          {/* <Likes id={props.id} slug={props.slug} navigationChange={dynamicRoute} likes={postLikes} setLikes={setPostLikes} /> */}
        </div>

        <div className={styles.bottomMatter}>
          <RelatedPosts tags={props.tags} blogPostId={props.id} />
          <br />
        </div>
        <Disclaimer />
      </div>
    </div>
  </>;
}
