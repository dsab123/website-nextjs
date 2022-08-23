import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({
  domain: 'db.us.fauna.com', 
  secret: `${process.env.FAUNA_KEY}` 
});

export const databaseClient = {
  getLikes: async (id: number, slug: string): Promise<FaunaResponse> => { 
    // if does not exist, create record with 0 likes
    const doesDocExist = await client.query(
      q.Exists(q.Match(q.Index('blogLikes'), slug))
    );
  
    if (!doesDocExist) {
      await client.query(
        q.Create(q.Collection('blogLikes'), {
          data: { slug: slug, likes: 0 },
        })
      );
    }
  
    const document = await client.query(
      q.Get(q.Match(q.Index('blogLikes'), slug))
    ) as any;

    return {
      statusCode: 200,
      body: JSON.stringify({
        likes: document.data.likes
      })
    };
  },

  postLikes: async (id: number, slug: string): Promise<FaunaResponse> => {
    // if already exist, upsert
    const doesDocExist = await client.query(
      q.Exists(q.Match(q.Index('blogLikes'), slug))
    );
    
    if (!doesDocExist) {
      await client.query(
        q.Create(q.Collection('blogLikes'), {
          data: { slug: slug, likes: 0 },
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
    ) as any;

    return {
      statusCode: 200,
      body: JSON.stringify({
        likes: updatedDocument.data.likes
      })
    };
  }
}