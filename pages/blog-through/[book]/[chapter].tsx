import fs from 'fs';
import path from 'path';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Likes from '../../../components/Likes';
import blogThroughs from '../../../data/blog-through.json';
import styles from '../../../styles/Chapter.module.css';
import BookHover from '../../../components/BookHover';

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  try {
    const bookSection = blogThroughs.books.find(x => x.slug === context.params.book);
    const chapterSection = bookSection.chapters.find(c => c.slug === context.params.chapter);
    const blogThroughsDirectory = path.join(process.cwd(), 'data/blog-throughs');
    const fullPath = `${blogThroughsDirectory}/${context.params.book}/${context.params.chapter}.md`;
    const postContents = fs.readFileSync(fullPath, 'utf8');
    const mdxSource = await serialize(postContents);

    return {
      props: {
        book: {
          slug: bookSection?.slug,
          title: bookSection?.title,
          subtitle: bookSection?.subtitle,
          author: bookSection?.author,
          imageUri: bookSection?.imageUri,
          ogImageUri: bookSection?.ogImageUri,
          teaser: bookSection?.teaser,
          tags: bookSection?.tags
        },
        chapter: {
          number: chapterSection?.number,
          slug: chapterSection?.slug,
          date: chapterSection?.date,
          title: chapterSection?.title
          // teaser: chapterSection?.teaser ?? '',
          // ogImageUri: chapterSection?.ogImageUri ?? ''
        },
        contents: mdxSource
      }
    }
  } catch (error) {
    console.table(error);
    return { notFound: true }
  }
}

export async function getStaticPaths() {
  const booksSection = blogThroughs.books;
  const paths = [];

  booksSection.forEach((book) => {
    book.chapters.forEach((chapter) => {
      paths.push({
        params: {
          book: book.slug,
          chapter: chapter.slug
        }
      });
     })
  });

  console.table(paths);

  return {
    paths: paths,
    fallback: false
  }
}

export default function Chapter(props: { book: BlogThroughBook; chapter: BlogThroughChapter; }) {

  const {book, chapter} = props;

  console.log(book.title);
  
  return <>
    <Head>
     <title key="original-title">{`Chapter ${chapter.number} - ${book.title} | Daniel Sabbagh`}</title>
     <meta property="og:title" content={`Chapter ${chapter.number} - ${book.title} | Daniel Sabbagh`} key="title" />
     <meta property="og:description" content={book.teaser} key="description" />
     <meta property="og:type" content="article" key="type" />
     <meta property="og:image" content={`https:danielsabbagh.com/${book.imageUri}`} key="image" />

     <meta name="twitter:site" content="@_danielsabbagh" key="twitter-site" />
     <meta name="twitter:title" content={`Chapter ${chapter.number} - ${book.title} | Daniel Sabbagh`} key="twitter-title" />
     <meta name="twitter:description" content={book.teaser} key="twitter-description" />
     <meta name="twitter:image" content={`https:danielsabbagh.com/${book.imageUri}`} key="twitter-image" />
     <meta name="twitter:card"  content="summary_large_image" key="twitter-card" />
     <meta name="twitter:creator" content="@_danielsabbagh" key="twitter-creator" />
    </Head>


    <h1 className={styles.bookTitle}>{book.title}</h1>
    <h2 className={styles.chapterTitle}>Chapter {chapter.number} - <i>{chapter.title}</i></h2>

    <BookHover imageUri={book.imageUri} size="large"/>

  </>

  // return <>

  //   <div className={styles.blogLayout}>
  //     


  //     <div className={styles.topMatter}>
  //       <p className={styles.date}><em>{props.date}</em></p>
  //       <Likes id={props.id} slug={props.slug} navigationChange={dynamicRoute} likes={postLikes} setLikes={setPostLikes}/>
  //     </div>
  //     <div className={styles.separator}></div>

  //     <div >
  //       <br />
  //       <div className={styles.postContents}>
  //         <MDXRemote {...props?.postContents}></MDXRemote>
  //       </div>

  //       <br />

  //       <div className={styles.likesWrapper}>
  //           <Likes id={props.id} slug={props.slug} navigationChange={dynamicRoute} likes={postLikes} setLikes={setPostLikes}/>
  //       </div>

  //       <div className={styles.bottomMatter}>
  //         <br />
  //       </div>
  //       <Disclaimer />
  //       </div>
  //     </div>
  //   </>
}