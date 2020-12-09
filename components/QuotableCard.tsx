import Link from 'next/link'
import styles from './QuotableCard.module.css';

export default function QuotableCard(props) {
    const {quotable, isLoading, setIsLoading} = props;

    return <>
        <div key={quotable.quotableId} className={styles.quotableCardContainer}>
            <Link href='/quotable/[id]/[slug]' as={`/quotable/${quotable.quotableId}/${quotable.slug}`}>
                <a className={styles.postLinks} onClick={() => setIsLoading(true)}>
                    <div className={styles.quotableCardContent}>
                        <img className={styles.quotableCardImage} src={quotable.imageUri} />
                        <p className={styles.quotableCardTitle}>{quotable.title}</p>
                        <p className={styles.quotableCardTeaser}>{!isLoading && `${quotable.teaser} ...`}</p>
                    </div>
                </a>
            </Link>
        </div>
    </>;
}