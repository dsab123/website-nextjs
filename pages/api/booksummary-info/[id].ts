import { NextApiRequest, NextApiResponse } from "next";

type BookSummaryInfo = {
    summary_id: number,
    title: string
    author: string,
    link: string,
    teaser: string
    image_uri: string
    is_ready: boolean,
    slug: string,
    quality: number,
    payoff: number
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { id } } = req;

    const raw = await fetch(`https://7dfaiqkhk5.execute-api.us-east-1.amazonaws.com/stage/booksummaryinfo?summary_id=${id}`)
    const data = await raw.json() as BookSummaryInfo;
    
    res.json(data);
}