import { databaseClient } from './../../lib/databaseClient';
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  let id = 0;
  let slug = '';

  switch(req.method) {
    case 'GET':
      id = parseInt(req.query['id'] as string);
      slug = req.query['slug'] as string;

      if (req.headers['content-type'] != 'application/json') {
          res.setHeader('content-type', 'application/json');
          return res.status(400).end();
      }

      try {
        // since Fauna is dead now 💀
        // const { body } = await databaseClient.getLikes(id, slug);
        // const foo = JSON.parse(body) as any;
        
        // res.setHeader('content-Type', 'application/json');
        return res.status(200).end(JSON.stringify({
          id: id, 
          likes: 1
        }));
        
      } catch (error) {
        // console.table(error);
        return res.status(500).end(JSON.stringify({id: id, likes: 0}));
      }

    case 'POST':
      id = req.body.id;
      slug = req.body.slug;

      if (req.headers['content-type'] != 'application/json') {
          res.setHeader('content-type', 'application/json');
          return res.status(400).end();
      }

      try {
        const { body } = await databaseClient.postLikes(id, slug);
        const foo = JSON.parse(body) as any;
        
        res.setHeader('content-Type', 'application/json');
        return res.status(200).end(JSON.stringify({
          id: id, 
          likes: foo.likes
        }));


      } catch (error) {
        // console.table(error);
        return res.status(500).end(JSON.stringify({id: id, likes: 0}));
      }

    default:
        res.setHeader('Content-Type', 'application/json');
        return res.status(405).end(); // method not allowed
  }
}