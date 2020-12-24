import Link from 'next/link'
import styles from './QuotableCard.module.css';

export default function QuotableCard(props: { quotable: Quotable; isLoading: boolean; setIsLoading: Function; }) {
    const {quotable, isLoading, setIsLoading} = props;
    
    return <>
        <div key={quotable.quotableId} className={styles.quotableCardContainer}>
            <Link href='/quotable/[id]/[slug]' as={`/quotable/${quotable.quotableId}/${quotable.slug}`}>
                <a className={styles.postLinks} onClick={() => setIsLoading(true)}>
                    <div className={styles.quotableCardContent}>
                        <div className={isLoading ? styles.loadingQuotableImage : ''}>
                                <img className={!isLoading ? styles.quotableCardImage : styles.hiddenImage} src={`/${quotable.imageUri}`}/>
                        </div>
                        <div className={isLoading ? styles.loadingQuotableText : ''}>
                            <p className={styles.quotableCardTitle}>{quotable.title}</p>
                        </div>
                        <div className={isLoading ? styles.loadingQuotableText : ''}>
                            <p className={styles.quotableCardTeaser}>{!isLoading && `${quotable.teaser}`} </p>
                        </div>
                    </div>
                </a>
            </Link>
        </div>
    </>;
}