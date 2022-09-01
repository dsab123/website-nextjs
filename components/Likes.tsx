import { useEffect } from 'react';
import { Like } from 'grommet-icons';
import styles from './Likes.module.css';


export default function Likes(props: {id: number, slug: string, navigationChange?: string, likes: number, setLikes: Function, size?: string, isLoading?: boolean }) {
  const {id, slug, navigationChange, likes, setLikes, size, isLoading } = props;

  useEffect(() => {
    const getLikes = async () => {
      const response = await fetch(`/api/likes?id=${id}&slug=${slug}`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        },
      });
  
      const data = await response.json() as LikesItem;
      setLikes(data.likes);
    }

    getLikes();
  }, [likes, navigationChange]);

  const addLike = async (id: number, slug: string) => {
    const response = await fetch(`/api/likes`, {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        slug: slug
      })
    });

    const data = await response.json() as LikesItem;
    setLikes(data.likes);
  }

  return <div className={styles.outerLikesContainer}>
    <button className={isLoading ? `${styles.likesContainer} ${styles.hiddenLikesContainer}` : `${styles.likesContainer}` } onClick={(e) => {addLike(id, slug); e.preventDefault(); }}>
      <Like size={size ?? 'medium'} className={styles.likesIcon} />
      <p className={size === 'small' ? styles.smallLikesNumber : styles.likesNumber}>{likes}</p>
    </button>
  </div>
}