import { NextApiRequest, NextApiResponse } from "next";
import quotable from '../../../data/quotable.json';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { id } } = req;

    const ids = ((String) (id)).split(',').map(i => parseInt(i));

    const quotables = quotable.quotables.filter(x => ids.includes(x.quotableId));
    
     if (quotables.length > 0) {
        if (quotables.length == 1) {
            return res.status(200).json(quotables.shift());    
         }

        return res.status(200).json(quotables);
    }

    return res.status(404).end();
}