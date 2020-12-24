import { NextApiRequest, NextApiResponse } from "next";
import blogpost from '../../../data/blogpost.json';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { id } } = req;
    const post = blogpost.blogposts.find(x => x.blogpostId == Number(id));
    
    if (post) {
        return res.status(200).json(post);
    }

    res.status(404).end();
}