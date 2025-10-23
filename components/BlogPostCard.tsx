
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import Likes from './Likes';
import styles from './BlogPostCard.module.css';
import { formatDate } from '../lib/dateHelper';

export default function BlogPostCard(props: { post: BlogPostInfo; isLoading: boolean; setIsLoading: Function; likes?: number }) { // add like from inside blogpostcard
  const { post, isLoading, setIsLoading, likes } = props;
  const [postCardLikes, setPostCardLikes] = useState(0);

  return <>
    {isLoading ? (
      <div className={styles.postCardContainer}>
        <div className={styles.loadingPostImage}></div>
        <div className={styles.loadingTitleText}></div>
        <div className={styles.loadingTeaserText}></div>
        <div className={styles.loadingDateText}></div>
      </div>
    ) : (
      <Link legacyBehavior href='/blog/[id]/[slug]' as={`/blog/${post.blogpostId}/${post.slug}`}>
        <a className={styles.postLinks}>
          <div className={styles.postCardContainer}>
            <div className={styles.postCardImageWrap}>
              <Image
                alt={post.title}
                className={!isLoading ? styles.postCardImage : styles.hiddenImage}
                src={`/${post.imageUri}`}
                fill   // <-- use fill + object-fit
                sizes="(min-width: 1024px) 317px, 45vw"
              />
            </div>

            <div className={styles.postCardContent}>
              <div className={styles.postCardTags}>
                {post.tags.slice(0, 3).map((tag, i) => (
                  <span key={tag} className={styles.postCardTag}>
                    {i > 0 ? ' · ' : ''}{tag}
                  </span>
                ))}
              </div>

              <p className={styles.postCardTitle}>{post.title}</p>
              <p className={styles.postCardTeaser}>{post.teaser}</p>

              <p className={styles.postCardDate}>{formatDate(post.date)}</p>
            </div>
          </div>
        </a>
      </Link>
    )}
  </>;
}