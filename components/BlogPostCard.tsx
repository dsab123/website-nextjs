import Link from 'next/link'
import styles from './BlogPostCard.module.css';

export default function BlogPostCard(props: { post: any; isLoading: any; setIsLoading: any; }) {
    const {post, isLoading, setIsLoading} = props;

    return <>
            <div key={post.blogpostId} className={styles.postCardContainer}>
                <Link href='/blog/[id]/[slug]' as={`/blog/${post.blogpostId}/${post.slug}`}>
                    <a className={styles.postLinks} onClick={() => setIsLoading(true)}>
                        <div className={styles.postCardContent}>
                            <div className={isLoading ? styles.loadingPostImage : ''}>
                                    <img className={!isLoading ? styles.postCardImage : styles.hiddenImage} src={`/${post.imageUri}`}/>
                            </div>
                            <div className={isLoading ? styles.loadingPostText : ''}>
                                <p className={styles.postCardTitle}>{post.title}</p>
                            </div>
                            <div className={isLoading ? styles.loadingPostText : ''}>
                                <p className={styles.postCardTeaser}>{!isLoading && `${post.teaser}`} </p>
                            </div>
                        </div>
                    </a>
                </Link>
            </div>
        </>;
}