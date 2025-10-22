
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Likes from './Likes';
import styles from './BlogPostCard.module.css';
import { formatDate } from '../lib/dateHelper';

export default function BlogPostCard(props: { post: BlogPostInfo; isLoading: boolean; setIsLoading: Function; likes?: number }) { // add like from inside blogpostcard
  const {post, isLoading, setIsLoading, likes} = props;
  const [postCardLikes, setPostCardLikes] = useState(0);

  const IMAGE_HEIGHT = '317';
  const IMAGE_WIDTH = '317';

  return <>
    <Link legacyBehavior href='/blog/[id]/[slug]' as={`/blog/${post.blogpostId}/${post.slug}`}>
      <a className={styles.postLinks}>
        <div key={post.blogpostId} className={styles.postCardContainer}>
          <div className={styles.postCardContent}>
            <div className={isLoading ? styles.loadingPostImage : ''}>
              <Image alt="blogpost image" className={!isLoading ? styles.postCardImage : styles.hiddenImage} src={`/${post.imageUri}`} height={IMAGE_HEIGHT} width={IMAGE_WIDTH} />
            </div>
              <p className={isLoading ? `${styles.postCardTitle} ${styles.loadingTitleText}` : styles.postCardTitle}>{post.title}</p>
              <p className={isLoading ? `${styles.postCardTeaser} ${styles.loadingTeaserText}` : styles.postCardTeaser}>{post.teaser} </p>
            <div className={isLoading ? `${styles.postText} ${styles.loadingDateText}` : `${styles.postText}` }>
              <p className={styles.postCardDate}>{formatDate(post.date)}</p>
              {/* since Fauna is dead now 💀 */}
              {/* <Likes id={post.blogpostId} slug={post.slug} likes={postCardLikes} setLikes={setPostCardLikes} size='small' isLoading={isLoading}></Likes> */}
            </div>
          </div>
        </div>
      </a>
    </Link>
  </>
}