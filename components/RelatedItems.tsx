import styles from './RelatedItems.module.css';

export default function RelatedItems(props) {
    return <>
    <div className={styles.postTagContainer}>
        <div>
            <p className={styles.relatedPostsText}>related:</p>
        </div>
        {props.items.map((item) => (
        <div key={item} className={props.isLoading ? `${styles.postTags} ${styles.dimOverlay}` : styles.postTags}>
            <a className={styles.postTag} onClick={() => props.displayPost(item)}>
                {item}
            </a>
        </div>
        ))}
    </div>
    </>;
}