import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'POST':
            const reqBody = req.body as EmailItem;

            if (req.headers['content-type'] != 'application/json') {
                res.setHeader('content-type', 'application/json');
                return res.status(400).end();
            }
            
            const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-MailerLite-ApiKey': process.env.EMAIL_POST_API_KEY
                },
                body: JSON.stringify({
                    email: reqBody.email, 
                    fields: {
                        page_uri: reqBody.pageUri
                    }
                })
            });

            if (response.status == 200) {
                res.setHeader('content-Type', 'application/json');
                return res.status(200).end();
            } 

            res.setHeader('content-Type', 'application/json');
            return res.status(500).end();

        default:
            res.setHeader('Content-Type', 'application/json');
            return res.status(405).end(); // method not allowed
      }
}