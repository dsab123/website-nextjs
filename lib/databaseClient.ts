import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({
  domain: 'db.us.fauna.com', 
  secret: `${process.env.FAUNA_KEY}` 
});

export const databaseClient = {
  getLikes: async (id: number, slug: string): Promise<number> => { 
    console.log('id is: ' + id)

    const doesDocExist = await client.query(
      q.Exists(q.Match(q.Index('blogLikes'), slug))
    );
  
    if (!doesDocExist) {
      await client.query(
        q.Create(q.Collection('blogLikes'), {
          data: { slug: slug, likes: 1 },
        })
      );
    }
  
    const document = await client.query(
      q.Get(q.Match(q.Index('blogLikes'), slug))
    ) as any;
    console.table(document);
    console.log('returning: ' + document.data.likes)
    return document.data.likes; // make this return better, with statuscode of course

  },

  postLikes: async (id: number, slug: string): Promise<number> => {
    // if already exist, upsert
    console.log('post; id is: ' + id)
    const doesDocExist = await client.query(
      q.Exists(q.Match(q.Index('blogLikes'), slug))
    );
    
    if (!doesDocExist) {
      await client.query(
        q.Create(q.Collection('blogLikes'), {
          data: { slug: slug, likes: 1 },
        })
      );
    }
  
    const document = await client.query(
      q.Get(q.Match(q.Index('blogLikes'), slug))
    ) as any;
  
    await client.query(
      q.Update(document.ref, {
        data: {
          likes: document.data.likes + 1,
        },
      })
    );
  
    const updatedDocument = await client.query(
      q.Get(q.Match(q.Index('blogLikes'), slug))
    )as any;

      return updatedDocument.data.likes;
    }
}