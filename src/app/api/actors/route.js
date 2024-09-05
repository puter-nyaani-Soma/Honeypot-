import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('sample_mflix');
    const actorsCollection = db.collection('users');

    const actors = await actorsCollection.find({}).skip(skip).limit(limit).toArray();
    const total = await actorsCollection.countDocuments();

    await client.close();
    
    return new Response(JSON.stringify({ actors, total }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching actors:', error);
    return new Response(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
  }
}
