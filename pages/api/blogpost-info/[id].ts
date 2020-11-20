import { NextApiRequest, NextApiResponse } from "next";

type BlogPostInfo = {
    blogpost_id: number,
    slug: string,
    title: string,
    teaser: string,
    tags: Array<string>
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { id } } = req;

    const raw = await fetch(`https://7dfaiqkhk5.execute-api.us-east-1.amazonaws.com/stage/blogpostinfo/${id}`);
    const data = await raw.json() as BlogPostInfo;

    return res.json(data);
}