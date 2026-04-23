import type { GetServerSideProps } from 'next';
import Blog, { getServerSideProps as blogGetServerSideProps } from './blog/[id]/[slug]';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Pretend we're building /blog/4/about
  return await blogGetServerSideProps({
    ...context,
    params: { id: '4', slug: 'about' },
  } as any);
};

export default Blog;

// export default function About() {
//   const aboutProps = {
//       "blogpostId": 4,
//       "slug": "about",
//       "title": "Why?",
//       "teaser": "Theological musings, mostly",
//       "tags": [
//         "meta"
//       ],
//       "imageUri": "blogpost/book-sign.jpg",
//       "date": "10-19-2025",
//       "isReady": true
//   };

//   return blog(aboutProps);
// }