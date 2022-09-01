import { databaseClient } from './../../lib/databaseClient';
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  switch(req.method) {
    case 'GET':
      if (req.headers['content-type'] != 'application/json') {
          res.setHeader('content-type', 'application/json');
          return res.status(400).end();
      }

      try {
        const { body } = await databaseClient.getAllLikes();
        const foo = JSON.parse(body) as LikesItem[];
        
        res.setHeader('content-Type', 'application/json');
        return res.status(200).end(JSON.stringify(foo));
        
      } catch (error) {
        // console.table(error);
        return res.status(500).end(JSON.stringify({}));
      }
      
    default:
      res.setHeader('Content-Type', 'application/json');
      return res.status(405).end(); // method not allowed
  }
}