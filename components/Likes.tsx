import { useEffect } from 'react';
import { Like } from 'grommet-icons';
import styles from './Likes.module.css';


export default function Likes(props: {id: number, slug: string, navigationChange: string, postLikes: number, setPostLikes: Function }) {
  useEffect(() => {
    const getLikes = async () => {
      const response = await fetch(`/api/likes?id=${props.id}&slug=${props.slug}`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        },
      });
  
      const data = await response.json() as LikesItem;
      props.setPostLikes(data.likes);
    }
  
    getLikes();
  }, [props.postLikes, props.navigationChange]);

  const addLike = async (id: number, slug: string) => {
    const response = await fetch(`/api/likes`, {
      method: 'POST',
      headers: {
          'content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        slug: slug
      })
    });
    const data = await response.json() as LikesItem;
    props.setPostLikes(data.likes);
  }

  return <div className={styles.outerLikesContainer}>
    <a className={styles.likesContainer} onClick={() => addLike(props.id, props.slug)}>
      <Like size="medium" className={styles.likesIcon}/> 
      <p className={styles.likesNumber}>{props.postLikes}</p>
    </a>
  </div>
}