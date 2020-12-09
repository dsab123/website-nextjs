import { NextApiRequest, NextApiResponse } from "next";
import blogpost from '../../data/blogpost.json';

type BlogpostLookupItem = {
    blogpostId: number,
    slug: string,
    title: string,
    teaser: string,
    isReady: true
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(blogpost.blogposts);
}