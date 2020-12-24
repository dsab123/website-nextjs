import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import styles from '../styles/Home.module.css';
import SummaryStyles from '../styles/Summaries.module.css';
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
  let response = await fetch('/api/quotable-lookup');

  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }

  const quotables = await response.json() as Quotable[];
  return quotables.shift();
}

async function fetchFrontPageBookSummaries(): Promise<BookSummaryInfo[]> {
  const ids = [4, 5];

  let response = await fetch(`/api/booksummary-info/${ids.join(',')}`);

  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }

  return await response.json() as BookSummaryInfo[];
}

export default function Home() {
  // Blog post state
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [postInfo, setPostInfo] = useState<BlogPostInfo>(
    {blogpostId: 1, slug: "", title: "", teaser: "", isReady: true}
  );

  useEffect(() => {
    fetchLatestBlogPostInfo(14) // hardcoded for now
      .then(info => {
        if (isPostLoading) {
          setPostInfo(info);
          setIsPostLoading(false);
        }
      });
  }, [isPostLoading]);

  // Quotable state
  const [isQuotableLoading, setIsQuotableLoading] = useState(true);
  const [quotable, setQuotable] = useState<Quotable>(
    {
      quotableId: 1,
      title: '',
      imageUri: '',
      teaser: '',
      slug: '',
      content: ''
    }
  );

  useEffect(() => {
    fetchLatestQuotable()
      .then(quotable => {
        if (isQuotableLoading) {
          setQuotable(quotable);
          setIsQuotableLoading(false);
        }
      });
  }, [isQuotableLoading]);

  // BookSummary state
  const [isSummariesLoading, setIsSummariesLoading] = useState(true);
  const [summaries, setSummaries] = useState<BookSummaryInfo[]>(
    [
      {
        summaryId: 999,
        title: '',
        author: '',
        link: '',
        teaser: '',
        imageUri: '',
        isReady: true,
        slug: '',
        quality: 1,
        payoff: 1
      },
      {
        summaryId: 9999,
        title: '',
        author: '',
        link: '',
        teaser: '',
        imageUri: '',
        isReady: true,
        slug: '',
        quality: 1,
        payoff: 1
      }
    ]
  );

  useEffect(() => {
    fetchFrontPageBookSummaries()
      .then(summaries2 => {
        if (isSummariesLoading) {
          setSummaries(summaries2);
          setIsSummariesLoading(false);
        }
      });
  }, [isSummariesLoading]);

  return <>
      <Head>
        <title key="original-title">Daniel Sabbagh | Reading Is Essential</title>
        <meta property="og:title" content="Daniel Sabbagh | Reading Is Essential" key="title" />
          <meta property="og:description" content="Reading Is Essential." key="description" />
          <meta property="og:type" content="article" key="type" />
          <meta property="og:image" content={`https://danielsabbagh.com/static/mobile-logo-large.jpg`} key="image" />

          <meta name="twitter:title" content="Daniel Sabbagh | Reading Is Essential" key="twitter-title" />
          <meta name="twitter:description" content="Reading Is Essential." key="twitter-description" />
          <meta name="twitter:image" content={`https://danielsabbagh.com/static/mobile-logo-large.jpg`} key="twitter-image" />
          <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
          <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />
          <meta name="twitter:site" content="@_danielsabbagh" key="twitter-site" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Welcome!</h1>

      <div className={styles.aboutPageTeaser}>
        <h2 className={styles.headerTeaser}>My mission is to help you read more this year.</h2>
        
        <div className={styles.rightSideLink}>
          <Link href="/blog/4/about">
            <a className={styles.teaserLink}>Why?</a>
          </Link>
        </div>
      </div>

      <div className={styles.summariesPageTeaser}>
        <h2 className={styles.title}>Featured Book Summaries</h2>
        <div className={isSummariesLoading ? styles.dimOverlay: ''}>
          {summaries.map((summary) => (
              <div key={summary.summaryId} className={SummaryStyles.card}>
              <div className={isSummariesLoading ? SummaryStyles.loadingBookImage : ''}>
                  {!isSummariesLoading && 
                  <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summaryId}/${summary.slug}`}>
                      <img className={summary.isReady ? SummaryStyles.bookImage : SummaryStyles.nonAnimatedBookImage} src={summary.imageUri} />
                  </Link>}
              </div>
              <div className={SummaryStyles.cardText}>
                  <div className={isSummariesLoading ? SummaryStyles.loadingBookText : ''}>
                      <p className={SummaryStyles.bookTitle}>{summary.title}</p>
                  </div>
                  <div className={isSummariesLoading ? SummaryStyles.loadingBookText : ''}>
                      <p className={SummaryStyles.bookAuthor}>{summary.author}</p>
                  </div>
                  <div className={isSummariesLoading ? SummaryStyles.loadingBookText : ''}>
                      <p className={SummaryStyles.bookTeaser}>{summary.teaser}</p>
                  </div>
                  <div className={SummaryStyles.summaryDetail}>
                      <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summaryId}/${summary.slug}`}>
                          <a className={summary.isReady ? SummaryStyles.readMore : SummaryStyles.hidden}>
                              read review
                          </a>
                      </Link>
                      <p className={summary.isReady ? SummaryStyles.hidden : SummaryStyles.comingSoon}>
                          review coming soon
                      </p>
                      <a className={isSummariesLoading ? `${SummaryStyles.amazonLink} ${SummaryStyles.inactiveLink}` : SummaryStyles.amazonLink} href={isSummariesLoading ? '' : summary.link} target="_blank">buy from amazon</a>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />

      <div className={styles.blogsPageTeaser}>
        <h2 className={styles.title}>From the Blog</h2>

        <div className={isPostLoading ? `${styles.dimOverlay} ${styles.blogsPageTeaserContainer}` : `${styles.blogsPageTeaserContainer}`}>
          <BlogPostCard isLoading={isPostLoading} post={postInfo} setIsLoading={setIsPostLoading}></BlogPostCard>
          <QuotableCard isLoading={isQuotableLoading} quotable={quotable} setIsLoading={setIsQuotableLoading}></QuotableCard>          
        </div>
      </div>
  </>;
}