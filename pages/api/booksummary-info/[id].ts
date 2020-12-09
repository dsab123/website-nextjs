import { NextApiRequest, NextApiResponse } from "next";
import summary from '../../../data/summary.json';

type BookSummaryInfo = {
    summaryId: number,
    title: string,
    author: string,
    link: string,
    teaser: string,
    imageUri: string,
    isReady: boolean,
    slug: string,
    quality: number,
    payoff: number,
    category: string
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { id } } = req;
    const bookSummary = summary.summaries.find(x => x.summaryId == Number(id));
    
    if (bookSummary) {
        return res.status(200).json(bookSummary);
    }

    return res.status(404).end();
}