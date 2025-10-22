import { NextApiRequest, NextApiResponse } from 'next';
import summary from '../../data/summary.json';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(summary.summaries);
}