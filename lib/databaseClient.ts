import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({
  domain: 'db.us.fauna.com', 
  secret: `${process.env.FAUNA_KEY}` 
});

const indexName = process.env.NODE_ENV === 'production' ? 'blogLikes' : 'blogLikesTest';
const collectionName = indexName;

export const databaseClient = {
  getLikes: async (id: number, slug: string): Promise<FaunaResponse> => { 
    // if does not exist, create record with 0 likes
    const doesDocExist = await client.query(
      q.Exists(q.Match(q.Index(indexName), slug))
    );
  
    if (!doesDocExist) {
      await client.query(
        q.Create(q.Collection(collectionName), {
          data: { slug: slug, id: id, likes: 0 },
        })
      );
    }
  
    const document = await client.query(
      q.Get(q.Match(q.Index(indexName), slug))
    ) as any; // change any

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
      q.Exists(q.Match(q.Index(indexName), slug))
    );
    
    if (!doesDocExist) {
      await client.query(
        q.Create(q.Collection(collectionName), {
          data: { slug: slug, id: id, likes: 0 },
        })
      );
    }
  
    const document = await client.query(
      q.Get(q.Match(q.Index(indexName), slug))
    ) as any; // change any
  
    await client.query(
      q.Update(document.ref, {
        data: {
          likes: document.data.likes + 1,
        },
      })
    );
  
    const updatedDocument = await client.query(
      q.Get(q.Match(q.Index(indexName), slug))
    ) as any; // change any

    return {
      statusCode: 200,
      body: JSON.stringify({
        likes: updatedDocument.data.likes
      })
    };
  },

  getAllLikes: async (): Promise<FaunaResponse> => { // rename FaunaResponse because it's not a Fauna type
    const document = await client.query(q.Map(
      q.Paginate(q.Documents(q.Collection(collectionName))),
      q.Lambda(x => q.Get(x))
    )) as any; // change any

      const filteredData = document.data.map((i: any) => { // need new type for data enclosing...
        return {
          slug: i.data.slug,
          id: i.data.id,
          likes: i.data.likes
        }
      });

    return {
      statusCode: 200,
      body: JSON.stringify(filteredData)
    };
  }
}