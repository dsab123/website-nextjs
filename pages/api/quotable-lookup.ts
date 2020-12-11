import { NextApiRequest, NextApiResponse } from "next";
import quotable from '../../data/quotable.json';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(quotable.quotables);
}