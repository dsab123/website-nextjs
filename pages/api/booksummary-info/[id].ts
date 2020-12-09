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

    const ids = ((String) (id)).split(',').map(i => parseInt(i));

    const summaries = summary.summaries.filter(x => ids.includes(x.summaryId));
    
     if (summaries.length > 0) {
        return res.status(200).json(summaries);
    }

    return res.status(404).end();
}