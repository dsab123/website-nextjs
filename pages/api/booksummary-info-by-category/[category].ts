import { NextApiRequest, NextApiResponse } from "next";
import summary from '../../../data/summary.json';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { category } } = req;

    const categories = ((String) (category)).split(',').map(c => c.toLowerCase());

    const summaries = summary.summaries.filter(x => categories.includes(x.category));
    
     if (summaries.length > 0) {
        return res.status(200).json(summaries);
    }

    return res.status(404).end();
}