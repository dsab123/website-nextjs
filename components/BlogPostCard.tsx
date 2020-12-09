import Link from 'next/link'
import styles from './BlogPostCard.module.css';

export default function BlogPostCard(props: { post: any; isLoading: any; setIsLoading: any; }) {
    const {post, isLoading, setIsLoading} = props;

    return <>
            <div key={post.blogpostId} className={styles.postCardContainer}>
                <Link href='/blog/[id]/[slug]' as={`/blog/${post.blogpostId}/${post.slug}`}>
                    <a className={styles.postLinks} onClick={() => setIsLoading(true)}>
                        <div className={styles.postCardContent}>
                            <img className={styles.postCardImage} src="/blogpost/silver.jpg" />
                            <p className={styles.postCardTitle}>{post.title}</p>
                            <p className={styles.postCardTeaser}>{!isLoading && `${post.teaser} ...`}</p>
                        </div>
                    </a>
                </Link>
            </div>
        </>;
}