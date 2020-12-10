import { NextApiRequest, NextApiResponse } from "next";
import quotable from '../../data/quotable.json';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    console.log(quotable.quotables);
    res.status(200).end(quotable.quotables);
}