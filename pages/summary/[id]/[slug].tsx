import fs from 'fs';
import path from 'path';
import { useState, useRef } from 'react';
import Head from 'next/head';
import { GetStaticPropsContext } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import readingTime from 'reading-time';
import summary from '../../../data/summary.json';
import styles from '../../../styles/Summary.module.css';
import BookHover from '../../../components/BookHover';
import Disclaimer from '../../../components/Disclaimer';

export async function getStaticProps(context: GetStaticPropsContext) {
  try {
    const summaryInfo = await fetchServerSideBookSummaryInfo(context);

    const postsDirectory = path.join(process.cwd(), 'data/summaries');
    const fullPath = `${postsDirectory}/${context.params.slug}.md`;

    const postContents = fs.readFileSync(fullPath, 'utf8');

    const mdxSource = await serialize(postContents);
    const timeToRead = Math.floor(readingTime(postContents).minutes);

    return {
      props: {
        id: context.params.id,
        summaryInfo: summaryInfo,
        summaryContents: mdxSource,
        timeToRead: timeToRead
      }
    };
  } catch (error) {
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const summaryInfos = summary.summaries;

  return {
    paths: summaryInfos.map((summaryInfo) => {
      return {
        params: {
          id: `${summaryInfo.summaryId}`,
          slug: summaryInfo.slug
        }
      };
    }),
    fallback: false
  };
}

async function fetchServerSideBookSummaryInfo(context: GetStaticPropsContext) {
  return summary.summaries.find(x => x.summaryId == Number(context.params.id));
}

function getPayoffRanking(payoff: number) {
  return Array(payoff).fill('👍');
}

function getQualityRanking(payoff: number) {
  return Array(payoff).fill('⭐');
}

function buildShareToSocialLink(selection: string, socialPlatform: string, setSocialLink: Function): string {
  if (typeof window === 'undefined') {
    return;
  }

  let link = '';

  if (socialPlatform == 'twitter') {
    link += 'https://twitter.com/intent/tweet?';
    link += 'url=' + escape(document.URL);
    link += '&text=' + escape(selection + ' ...');
  } else if (socialPlatform == 'facebook') {
    link += 'https://www.facebook.com/dialog/share?&display=popup';
    link += `&href=${document.URL}`;
    link += '&app_id=2863776890531694';
    link += `&redirect_uri=${document.URL}`;
    link += '&quote=' + escape(selection) + ' ...';
  }

  setSocialLink(link);
}

export default function Summary(props) {
  const refContainer = useRef(null);
  const [socialLink, setSocialLink] = useState('');

  const [error, setError] = useState('');

  return <>
    <Head>
      <title key="original-title">{`${props.summaryInfo.title} | Daniel Sabbagh`}</title>
      <meta property="og:title" content={`${props.summaryInfo.title} | Daniel Sabbagh`} key="title" />
      <meta property="og:description" content={props.summaryInfo.teaser} key="description" />
      <meta property="og:type" content="article" key="type" />
      <meta property="og:image" content={`https://danielsabbagh.com/${props.summaryInfo.ogImageUri}`} key="image" />

      <meta name="twitter:title" content={`${props.summaryInfo.title} | Daniel Sabbagh`} key="twitter-title" />
      <meta name="twitter:description" content={props.summaryInfo.teaser} key="twitter-description" />
      <meta name="twitter:image" content={`https://danielsabbagh.com/${props.summaryInfo.ogImageUri}`} key="twitter-image" />
      <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
      <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />
      <meta name="twitter:site" content="@_danielsabbagh" key="twitter-site" />
    </Head>
    <div className={styles.outer}>

      <h1 className={styles.summaryBookTitle}>{props.summaryInfo?.title}</h1>
      <p className={styles.author}>{props.summaryInfo?.author}</p>

      <div className={styles.metrics}>
        <div className={styles.metricsTitles}>
          <p className={styles.qualityTitle}>Quality </p>
          <p className={styles.payoffTitle}>Payoff </p>
        </div>
        <div className={styles.metricsMeasures}>
          <p className={styles.qualityMeasure}>{getQualityRanking(props.summaryInfo?.quality)}</p>
          <p className={styles.payoffMeasure}>{getPayoffRanking(props.summaryInfo?.payoff)}</p>
        </div>
      </div>
      <br />

      <div className={styles.inner}>
        <a className={styles.bookLink} href={props.summaryInfo?.link} target="_blank">
          <BookHover imageUri={'/' + props.summaryInfo?.imageUri} size='large' />
        </a>
        <div className={styles.teaserAndButton}>
          <div className={styles.teaserWrapper}>
            <p className={styles.teaser}>{props.summaryInfo?.teaser}</p>
            <div className={styles.socialWrapper}>
              <a href={socialLink} onClick={() => buildShareToSocialLink(props.summaryInfo?.teaser, 'facebook', setSocialLink)} target="_blank">
                <img className={styles.socialIcon} alt="facebook share" src="/static/facebook-filled.png"></img>
              </a>
              &nbsp;
              <a href={socialLink} onClick={() => buildShareToSocialLink(props.summaryInfo?.teaser, 'twitter', setSocialLink)} target="_blank">
                <img className={styles.socialIcon} alt="twitter share" src="/static/twitter-filled.png"></img>
              </a>
            </div>
          </div>
          {/* <a href={props.summaryInfo?.link} target="_blank"><img className={styles.buyButton} src="/static/wts-button.png" /> </a> */}
        </div>
      </div>

      <br />
      <br />
      <br />

      <p className={styles.readingTime}>Time to read: {props.timeToRead} minutes</p>
      <hr />

      <p className={styles.review}>Review/Summary/Reflections</p>

      <div className={!error && !props?.summaryContents ? styles.dimOverlay : ''}>

        {!props?.summaryContents && <div className={!error && !props?.summaryContents ? `${styles.dimOverlay} ${styles.summaryContents}` : styles.summaryContents}>
          <p>Loading review...</p>
        </div>}
        <div className={styles.summaryContents}>
          <MDXRemote {...props?.summaryContents}></MDXRemote>
        </div>
        <br />
        <br />
      </div>

      <Disclaimer />
    </div>
  </>;
}