import { NextApiRequest, NextApiResponse } from "next";

type BookSummaryLookupItem = {
    summary_id: number,
    title: string,
    author: string,
    link: string,
    teaser: string,
    image_uri: string,
    is_ready: boolean,
    slug: string,
    quality: number,
    payoff: number
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { slug } } = req;

    const raw = await fetch(`https://7dfaiqkhk5.execute-api.us-east-1.amazonaws.com/stage/booksummary?path=/blogposts/${slug}.md`);
    const data = await raw.json() as BookSummaryLookupItem[];

    console.log(data);

    res.json(data);
}