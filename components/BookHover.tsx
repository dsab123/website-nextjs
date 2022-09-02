import styles from './BookHover.module.css';

export default function BookHover(props: {imageUri: string, size?: string}) {
  const { imageUri, size } = props;

  return <div>
    <div className={size === "large" ? styles.largeBook : styles.book}>
      {/* we need these styles in here manually because we can't set the  background via CSS easily */}
      <div className={styles.bookCover} style={{background: `url('${imageUri}')`, backgroundSize: '100% 100%'}}>
        <div className={styles.effect}></div>
        <div className={styles.light}></div>
      </div>
      <div className={styles.bookInside}>
      </div>
    </div>
  </div>
}