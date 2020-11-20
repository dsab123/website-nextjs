import { NextApiRequest, NextApiResponse } from "next";

type BlogPostContents = {
    data: string;
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { slug } } = req;

    const raw = await fetch(`https://7dfaiqkhk5.execute-api.us-east-1.amazonaws.com/stage/booksummary?path=/blogposts/${slug}.md`);
    const data = await raw.json() as BlogPostContents;

    res.json(data);
}