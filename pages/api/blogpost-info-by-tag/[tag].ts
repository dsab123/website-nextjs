import { NextApiRequest, NextApiResponse } from "next";

type BlogPostInfoByTag = {
    blogpost_id: number,
    slug: string,
    title: string,
    teaser: string
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { tag } } = req;

    const raw = await fetch(`https://7dfaiqkhk5.execute-api.us-east-1.amazonaws.com/stage/tags/${tag}/`);
    const data = await raw.json() as BlogPostInfoByTag;
    
    res.json(data);
}