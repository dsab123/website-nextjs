import { NextApiRequest, NextApiResponse } from "next";
import quotable from '../../../data/quotable.json';

type Quotable = {
    quotableId: number,
    title: string,
    imageUri: string,
    teaser: string,
    slug: string,
    tags: string[],
    content: string
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
    console.log('begin')

    const { query: { id } } = req;

    const ids = ((String) (id)).split(',').map(i => parseInt(i));

    const quotables = quotable.quotables.filter(x => ids.includes(x.quotableId));
    
     if (quotables.length > 0) {

        console.log('returning 200 probs')
        if (quotables.length == 1) {
            return res.status(200).json(quotables.shift());    
         }

        return res.status(200).json(quotables);
    }
console.log('returning 404')
    return res.status(404).end();
}