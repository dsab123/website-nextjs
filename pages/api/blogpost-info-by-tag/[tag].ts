import { NextApiRequest, NextApiResponse } from "next";
import blogpost from '../../../data/blogpost.json';

// need to remove these typedefs
type BlogPostInfoByTag = {
    blogpostId: number,
    slug: string,
    title: string,
    tags: string[],
    teaser: string
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { tag } } = req;
    const posts = blogpost.blogposts.filter(x => x.isReady && x.tags.includes(String(tag).toLowerCase()));
    
     if (posts) {
        return res.status(200).json(posts);
    }

    return res.status(404).end();
}