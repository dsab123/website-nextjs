import { NextApiRequest, NextApiResponse } from "next";

type BlogpostLookupItem = {
    blogpost_id: number,
    slug: string,
    title: string,
    teaser: string,
    is_ready: true
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const raw = await fetch(`https://7dfaiqkhk5.execute-api.us-east-1.amazonaws.com/stage/blogpost-lookup/`);
    const data = await raw.json() as BlogpostLookupItem[];
    
    res.json(data);
}