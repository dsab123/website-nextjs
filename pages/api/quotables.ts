import { NextApiRequest, NextApiResponse } from "next";
import quotables from '../../data/quotable.json';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(quotables.quotables);
}