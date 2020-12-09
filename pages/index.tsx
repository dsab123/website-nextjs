import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import styles from '../styles/Home.module.css';
import BlogPostCard from '../components/BlogPostCard';
import QuotableCard from '../components/QuotableCard';

type BlogPostInfo = {
  blogpostId: number,
  slug: string,
  title: string,
  teaser: string,
  isReady: boolean
};

type BookSummaryInfo = {
  summaryId: number,
  title: string,
  author: string,
  link: string,
  teaser: string,
  imageUri: string,
  isReady: boolean,
  slug: string,
  quality: number,
  payoff: number
};

type Quotable = {
  quotableId: number,
  title: string,
  imageUri: string,
  teaser: string,
  slug: string,
  content: string
};

type FrontPageInfo = {
  postInfo: BlogPostInfo[],
  quotable: Quotable[],
  summaries: BookSummaryInfo[]
};

// TODO make api route to grab front page info - one blog post, one quotable, two
// summaries, where one is christian and the other is bestseller or something
async function fetchFrontPageInfo(): Promise<FrontPageInfo> {
  return null;

  
};


async function fetchLatestBlogPostInfo(blogPostId: number): Promise<BlogPostInfo> {
  let response = await fetch(`/api/blogpost-info/${blogPostId}`);

  if (response.status >= 400) {
      throw new Error("Bad response from server");
  }

  return await response.json() as BlogPostInfo;
}

async function fetchLatestQuotable(): Promise<Quotable> {
  let response = await fetch('/api/quotables');

  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }

  const quotables = await response.json() as Quotable[];
  return quotables.shift();
}

export default function Home() {
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [postInfo, setPostInfo] = useState<BlogPostInfo>(
    {blogpostId: 1, slug: "", title: "", teaser: "", isReady: true}
  );

  useEffect(() => {
    fetchLatestBlogPostInfo(2) // hardcoded for now
      .then(info => {
        if (isPostLoading) {
          setPostInfo(info);
          setIsPostLoading(false);
        }
      });
  }, [isPostLoading]);

  const [isQuotableLoading, setIsQuotableLoading] = useState(true);
  const [quotable, setQuotable] = useState<Quotable>(
    {
      quotableId: 1,
      title: "",
      imageUri: "",
      teaser: "",
      slug: "",
      content: ""
    }
  );

  useEffect(() => {
    fetchLatestQuotable()
      .then(quotable => {
        if (isQuotableLoading) {
          // figure this out because this is an array right now
          setQuotable(quotable);
          setIsQuotableLoading(false);
        }
      });
  }, [isQuotableLoading]);

  return <>
      <Head>
        <title key="original-title">Daniel Sabbagh | Reading Is Essential</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Welcome!</h1>

      <div className={styles.aboutPageTeaser}>
        <h2 className={styles.header}>My mission is to help you read more this year.</h2>
        
        <div className={styles.rightSideLink}>
          <Link href="/blog/4/about"><a className={styles.teaserLink}>Why?</a></Link>
        </div>
      </div>

      <div className={styles.blogsPageTeaser}>
      <h2 className={styles.header}>From the Blog</h2>

        <div className={isPostLoading ? `${styles.dimOverlay} ${styles.blogsPageTeaserContainer}` : `${styles.blogsPageTeaserContainer}`}>
          <BlogPostCard isLoading={isPostLoading} post={postInfo} setIsLoading={setIsPostLoading}></BlogPostCard>
          <QuotableCard isLoading={isPostLoading} quotable={quotable} setIsLoading={setIsPostLoading}></QuotableCard>          
        </div>
      </div>

      <div className={styles.summariesPageTeaser}>
        <h2 className={styles.header}>Featured Book Summaries</h2>

        {/* one christian book and one bestseller */}


      </div>
      
  </>;
}