import { NextApiRequest, NextApiResponse } from 'next';
import blogpost from '../../data/blogpost.json';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(blogpost.blogposts);
}