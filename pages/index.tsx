import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import SummaryStyles from '../styles/Summaries.module.css';
import BlogPostCard from '../components/BlogPostCard';
import BookHover from '../components/BookHover';
import Disclaimer from '../components/Disclaimer';

async function fetchLatestBlogPostInfo(blogPostId: number): Promise<BlogPostInfo> {
  let response = await fetch(`/api/blogpost-info/${blogPostId}`);

  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }

  return await response.json() as BlogPostInfo;
}

async function fetchFrontPageBookSummaries(): Promise<BookSummaryInfo[]> {
  const ids = [6, 12];

  let response = await fetch(`/api/booksummary-info/${ids.join(',')}`);

  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }

  return await response.json() as BookSummaryInfo[];
}

export default function Home() {
  // Blog post state
  const [isFirstPostLoading, setIsFirstPostLoading] = useState(true);
  const [firstPostInfo, setFirstPostInfo] = useState<BlogPostInfo>(
    { blogpostId: 1, slug: '', title: '', teaser: '', tags: [], imageUri: '', date: '', isReady: true },
  );

  const [isSecondPostLoading, setIsSecondPostLoading] = useState(true);
  const [secondPostInfo, setSecondPostInfo] = useState<BlogPostInfo>(
    { blogpostId: 1, slug: '', title: '', teaser: '', tags: [], imageUri: '', date: '', isReady: true },
  );


  useEffect(() => {
    fetchLatestBlogPostInfo(38) // hardcoded for now
      .then(info => {
        if (isFirstPostLoading) {
          setFirstPostInfo(info);
          setIsFirstPostLoading(false);
        }
      });
  }, [isFirstPostLoading]);

  useEffect(() => {
    fetchLatestBlogPostInfo(37) // hardcoded for now
      .then(info => {
        if (isSecondPostLoading) {
          setSecondPostInfo(info);
          setIsSecondPostLoading(false);
        }
      });
  }, [isSecondPostLoading]);

  // BookSummary state
  const [isSummariesLoading, setIsSummariesLoading] = useState(true);
  const [summaries, setSummaries] = useState<BookSummaryInfo[]>(
    [{
        summaryId: 999,
        title: '',
        author: '',
        link: '',
        teaser: '',
        imageUri: '',
        ogImageUri: '',
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
        ogImageUri: '',
        isReady: true,
        slug: '',
        quality: 1,
        payoff: 1
      }]
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

    <h1 className={styles.title}>Welcome to my blog 👋</h1>

    <div className={styles.aboutPageTeaser}>
      <h2 className={styles.headerTeaser}>I write at the intersection of reading and theology.</h2>

      <div className={styles.rightSideLink}>
        <Link href="/blog/4/about">
          <a className={styles.teaserLink}>Who am I?</a>
        </Link>
      </div>
    </div>

    <div className={styles.summariesPageTeaser}>
      <h2 className={styles.title}>Featured Book Summaries</h2>
      <div className={isSummariesLoading ? styles.dimOverlay : ''}>
        {summaries.map((summary) => (
          <div key={summary.summaryId} className={SummaryStyles.card}>
            <div className={isSummariesLoading ? SummaryStyles.loadingBookImage : ''}>
              {!isSummariesLoading &&
                <Link href='/summary/[id]/[slug]' as={`/summary/${summary.summaryId}/${summary.slug}`}>
                  <a>
                    <BookHover imageUri={summary.imageUri} size='small'/>
                  </a>
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

      <div className={isFirstPostLoading ? `${styles.dimOverlay} ${styles.blogsPageTeaserContainer}` : `${styles.blogsPageTeaserContainer}`}>
        <BlogPostCard isLoading={isFirstPostLoading} post={firstPostInfo} setIsLoading={setIsFirstPostLoading}></BlogPostCard>
        <BlogPostCard isLoading={isSecondPostLoading} post={secondPostInfo} setIsLoading={setIsSecondPostLoading}></BlogPostCard>
      </div>
    </div>

    <Disclaimer />
  </>;
}
