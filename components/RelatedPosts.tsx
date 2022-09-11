import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './RelatedPosts.module.css';

async function fetchBlogPostInfoByTag(tag: string): Promise<BlogPostInfoByTag[]> {
  let response = await fetch(`/api/blogpost-info-by-tag/${tag}`);
  if (response.status >= 400) {
    throw new Error("Bad response from server") // todo make this better
  }

  return await response.json() as Promise<BlogPostInfoByTag[]>;
}

export default function RelatedPosts(props: { 
  tags: string[],
  blogPostId: Number
}) {
  const { tags, blogPostId } = props;

   const dynamicRoute = useRouter().asPath;

   // clear related posts when loading new blog post
   useEffect(() => {
     setRelatedPosts([]);
     setShowRelatedPosts(false);
     setTag('');
   }, [dynamicRoute]);
 
     // examine this; it looks really bad to have four setters at the end there
  async function displayBlogPostsByTag(newTag: string) {
    if (newTag == tag) {
      setShowRelatedPosts(!showRelatedPosts);
      return;
    }

    setIsRelatedPostsLoading(true);

    const related = (await fetchBlogPostInfoByTag(newTag)).filter(x => x.blogpostId != blogPostId);
  
    setRelatedPosts(related);
    setShowRelatedPosts(true);
    setTag(newTag);
    setIsRelatedPostsLoading(false);
  }

  
   const [showRelatedPosts, setShowRelatedPosts] = useState(true);
   const [isRelatedPostsLoading, setIsRelatedPostsLoading] = useState(false);
   const [relatedPosts, setRelatedPosts] = useState<BlogPostInfoByTag[]>([]);
   const [tag, setTag] = useState('');

  return <>
  {tags?.length > 0 &&
    <div className={styles.relatedPostsContainer}>
      <div className={styles.postTagContainer}>
        <div>
          <p className={styles.relatedPostsText}>related:</p>
        </div>
        {tags.map((tag) => (
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