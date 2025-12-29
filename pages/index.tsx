import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import SummaryStyles from '../styles/Summaries.module.css';
import BlogPostCard from '../components/BlogPostCard';
import BookHover from '../components/BookHover';
import Disclaimer from '../components/Disclaimer';
import blogpost from '../data/blogpost.json';

async function fetchAllSummaries(): Promise<BookSummaryInfo[]> {
  const response = await fetch('/api/summaries');

  if (response.status >= 400) {
    throw new Error('Bad response from server');
  }

  return await response.json() as BookSummaryInfo[];
}

async function fetchAllBlogPosts(): Promise<BlogPostInfo[]> {
  const response = await fetch('/api/blogposts');

  if (response.status >= 400) {
    throw new Error('Bad response from server');
  }

  return await response.json() as BlogPostInfo[];
}

async function fetchBlogPostInfo(blogPostId: number): Promise<BlogPostInfo> {
  const response = await fetch(`/api/blogpost/${blogPostId}`);

  if (response.status >= 400) {
    throw new Error('Bad response from server');
  }

  return await response.json() as BlogPostInfo;
}

async function fetchFrontPageBookSummaries(ids: number[]): Promise<BookSummaryInfo[]> {
  const response = await fetch(`/api/summary/${ids.join(',')}`);

  if (response.status >= 400) {
    throw new Error('Bad response from server');
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

  function pickTwoDistinct<T>(arr: T[]): [T, T] | null {
    if (arr.length < 2) return null;
    const firstIdx = Math.floor(Math.random() * arr.length);
    let secondIdx = Math.floor(Math.random() * (arr.length - 1));
    if (secondIdx >= firstIdx) secondIdx += 1;
    return [arr[firstIdx], arr[secondIdx]];
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const all = await fetchAllBlogPosts();

        const candidates = all.filter(p => p.isReady);

        const picked = pickTwoDistinct(candidates.length >= 2 ? candidates : all);
        if (!picked) return;

        const [a, b] = picked;

        // fetch both in parallel
        const [info1, info2] = await Promise.all([
          fetchBlogPostInfo(a.blogpostId),
          fetchBlogPostInfo(b.blogpostId),
        ]);

        if (cancelled) return;

        setFirstPostInfo(info1);
        setSecondPostInfo(info2);
      } finally {
        if (!cancelled) {
          setIsFirstPostLoading(false);
          setIsSecondPostLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);



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
      seller: '',
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
      seller: '',
      payoff: 1
    }]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const all = await fetchAllSummaries();

        const candidates = all.filter(s => s.isReady);

        const picked = pickTwoDistinct(candidates.length >= 2 ? candidates : all);
        if (!picked) return;

        const [a, b] = picked;

        fetchFrontPageBookSummaries([a.summaryId, b.summaryId])
          .then(data => {
            if (isSummariesLoading) {
              setSummaries(data);
              setIsSummariesLoading(false);
            }
          });

      } finally {
        if (!cancelled) {
          setIsSummariesLoading(false);
        }
      }
    })();
  }, [isSummariesLoading]);

  return <>
    <Head>
      <title key="original-title">Daniel Sabbagh | Reading Is Essential</title>
      <meta property="og:title" content="Daniel Sabbagh | Reading Is Essential" key="title" />
      <meta property="og:description" content="Reading Is Essential." key="description" />
      <meta property="og:type" content="article" key="type" />
      <meta property="og:image" content={'https://danielsabbagh.com/static/mobile-logo-large.jpg'} key="image" />

      <meta name="twitter:title" content="Daniel Sabbagh | Reading Is Essential" key="twitter-title" />
      <meta name="twitter:description" content="Reading Is Essential." key="twitter-description" />
      <meta name="twitter:image" content={'https://danielsabbagh.com/static/mobile-logo-large.jpg'} key="twitter-image" />
      <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
      <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />
      <meta name="twitter:site" content="@_danielsabbagh" key="twitter-site" />

      <link rel="icon" href="/favicon.ico" />
    </Head>

    <h1 className={styles.title}>Welcome to my blog 👋</h1>

    <div className={styles.aboutPageTeaser}>
      <h2 className={styles.headerTeaser}>I write at the intersection of reading and theology.</h2>

      <div className={styles.rightSideLink}>
        <Link legacyBehavior href="/blog/4/about">
          <a className={styles.teaserLink}>Who am I?</a>
        </Link>
      </div>
    </div>

    <div className={styles.summariesPageTeaser}>
      <h2 className={styles.title}>Featured (Random) Book Summaries</h2>
      <div className={isSummariesLoading ? styles.dimOverlay : ''}>
        {summaries.map((summary) => (
          <div key={summary.summaryId} className={SummaryStyles.card}>
            <div className={isSummariesLoading ? SummaryStyles.loadingBookImage : ''}>
              {!isSummariesLoading &&
                <Link legacyBehavior href='/summary/[id]/[slug]' as={`/summary/${summary.summaryId}/${summary.slug}`}>
                  <a>
                    <BookHover imageUri={summary.imageUri} size='small' />
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
                <Link legacyBehavior href='/summary/[id]/[slug]' as={`/summary/${summary.summaryId}/${summary.slug}`}>
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
