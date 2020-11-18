import Link from 'next/link'
import useAxios from 'axios-hooks'

type BlogpostLookupItem = {
    blogpost_id: number,
    slug: string,
    title: string,
    teaser: string,
    is_ready: true
};

export default function Blogs() {
    try {  
        const [{ data, loading, error }, refetch] = useAxios('https://7dfaiqkhk5.execute-api.us-east-1.amazonaws.com/stage/blogpost-lookup/');
        const posts = data as BlogpostLookupItem[];
        
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error!</p>

        console.log('hello, emily: ' + posts);

        return (
            <ul>
                {posts.map((post) => (
                    <li key={post.blogpost_id}>
                    <Link
                        href={{
                            pathname: '/blog/[slug]',
                            query: { slug: post.slug },
                        }}
                    >
                    <a>{post.title}</a>
                </Link>
                </li>
                ))}
            </ul>
        )

    } catch (error) {
        console.log('hello, response is bad');
        console.error(error);
    }
}