import { NextApiRequest, NextApiResponse } from "next";
import summary from '../../data/summary.json';

type BookSummaryLookupItem = {
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
    res.status(200).json(summary.summaries);
}