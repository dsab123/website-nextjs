import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { slug } } = req;

    // todo move this to an environment variable dum-dum
    const raw = await fetch(`https://7dfaiqkhk5.execute-api.us-east-1.amazonaws.com/stage/booksummary?path=/blogposts/${slug}.md`);
    const data = await raw.json() as BlogPostContents;
    res.json(data);

    // const raw = fs.readFileSync(`/Users/daniel/workspace/book-summaries/blogposts/${slug}.md`, 'utf8');
    // console.log(`env is: ${process.env.NODE_ENV}`);
    // return res.send({data: raw});
}