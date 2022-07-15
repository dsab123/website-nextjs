import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { query: { slug } } = req;

    let raw: string | Response;

    if (process.env.NODE_ENV === "development") {
        raw = fs.readFileSync(process.env.BLOGPOST_CONTENTS_ENDPOINT + `${slug}.md`, 'utf8');
        return res.send({ data: raw });
    }

    raw = await fetch(process.env.BLOGPOST_CONTENTS_ENDPOINT + `${slug}.md`);
    const data = await raw.json() as BlogPostContents;
    res.json(data);
}