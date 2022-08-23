import { databaseClient } from './../../lib/databaseClient';
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  let id = 0;
  let slug = '';

  switch(req.method) {
    case 'GET':
      id = parseInt(req.query['id'] as string);
      slug = req.query['slug'] as string;
      console.log('id is pls pls ' + id)

      if (req.headers['content-type'] != 'application/json') {
          res.setHeader('content-type', 'application/json');
          return res.status(400).end();
      }

      try {

        const response = await databaseClient.getLikes(id, slug);
        res.setHeader('content-Type', 'application/json');
        return res.status(200).end(JSON.stringify({id: id, likes: response}));
      } catch (error) {
        // ERROR ERROR ERROR
        console.table(error);

        return res.status(500).end(JSON.stringify({id: id, likes: 0}));
      }
    case 'POST':
      console.log('wee')

      id = req.body.id;
      slug = req.body.slug;

      
      if (req.headers['content-type'] != 'application/json') {
          res.setHeader('content-type', 'application/json');
          return res.status(400).end();
      }

      try {
        const response = await databaseClient.postLikes(id, slug);
        res.setHeader('content-Type', 'application/json');
        return res.status(200).end(JSON.stringify({id: id, likes: response}));

      } catch (error) {
        // ERROR ERROR ERROR
        console.table(error);
        return res.status(500).end(JSON.stringify({id: id, likes: 0}));
      }


    default:
        res.setHeader('Content-Type', 'application/json');
        return res.status(405).end(); // method not allowed
  }
}