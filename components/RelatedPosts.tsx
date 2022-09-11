import Link from 'next/link';
import styles from './RelatedPosts.module.css';

export default function RelatedPosts(props: { 
  tags: string[],
  relatedPosts: BlogPostInfoByTag[]
  isRelatedPostsLoading: boolean, 
  displayBlogPostsByTag: Function, 
  showRelatedPosts: boolean,
  tag: string
}) {
  const {
    tags, 
    relatedPosts,
    isRelatedPostsLoading, 
    displayBlogPostsByTag,
    showRelatedPosts,
    tag
   } = props;

  return <>
  {props.tags?.length > 0 &&
    <div className={styles.relatedPostsContainer}>
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
      </div>

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
  </div>}
  </>
}