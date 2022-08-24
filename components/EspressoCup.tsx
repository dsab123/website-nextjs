import styles from './EspressoCup.module.css';

export default function EspressoCup() {
  return <>
    <div className={styles.container}>
      <div className={styles.steamContainer}>
      <div className={`${styles.steam} ${styles.steam1}`}> </div>
      <div className={`${styles.steam} ${styles.steam2}`}> </div>
      <div className={`${styles.steam} ${styles.steam3}`}> </div>
      <div className={`${styles.steam} ${styles.steam4}`}> </div>
      </div>

      <div className={styles.cup}>
        <div className={styles.cupHandle}></div>
        <div className={styles.cupBody}>
          <div className={styles.cupShade}></div>
        </div>
      </div>
      

      <div className={styles.saucer}></div>

      <div className={styles.shadow}></div>
  </div>
  </>;
}